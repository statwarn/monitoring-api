/*jshint maxcomplexity: 17*/
'use strict';
/**
 * MeasurementQuery value
 */
var filtrES = require('filtres');

module.exports = function (DateRangeInterval) {
  /**
   * Represent a measurement query
   * @param {Array} ids
   * @param {Array} fields
   * @param {Array} aggs
   * @param {DateRangeInterval} aggs
   * @private
   */
  function MeasurementQuery(ids, fields, filters, aggs, dateRangeInterval) {
    this.ids = ids;
    this.fields = fields;
    this.filters = filters;
    this.aggs = aggs;
    this.range = dateRangeInterval;
  }

  MeasurementQuery.schema = require('./MeasurementQuery.ValueObject.schema');

  MeasurementQuery.AGGS_MAPPING = {
    // public aggregation name -> private name
    'min': 'min',
    'max': 'max',
    'sum': 'sum',
    'avg': 'avg',
    'count': 'value_count',
    'stats': 'extended_stats'
  };

  MeasurementQuery.DEFAULT_AGGREGATION_TYPE = _.first(MeasurementQuery.schema.AGGREGATION_TYPES);

  // ensure at start time that the schema and the mapping are kept in sync
  assert(_.intersection(MeasurementQuery.schema.AGGREGATION_TYPES, _.keys(MeasurementQuery.AGGS_MAPPING)).length === MeasurementQuery.schema.AGGREGATION_TYPES.length);

  /**
   * @param  {Function} makeIndexFromId(id) -> String a delegate
   * @param  {String} index_document_type document type
   * @return {Object} elasticsearch query
   */
  MeasurementQuery.prototype.buildQuery = function (makeIndexFromId, index_document_type) {
    // First build the aggregation on fields
    var fields_aggs = this.fields.reduce(function (obj, field, i) {
      // ES needs an object of:
      //
      // 'used_memory': {
      //   avg: {
      //     field: 'used_memory'
      //   }
      // }
      //
      // with "used_memory" == field

      obj[field] = {};
      var public_aggregate_name = this.aggs[i];
      var es_aggregate_type = MeasurementQuery.AGGS_MAPPING[public_aggregate_name];
      obj[field][es_aggregate_type] = {
        field: field
      };
      return obj;
    }.bind(this), {});

    return {
      indices: this.ids.map(makeIndexFromId),
      type: index_document_type,
      fields: this.fields,
      search_type: 'count',
      body: {
        // size=0 to not show search hits because we only want to see the aggregation results in the response.
        size: 0,

        query: {
          filtered: {
            filter: {
              bool: {
                must: [{
                    range: {
                      timestamp: {
                        from: this.range.start_ts,
                        to: this.range.end_ts
                      }
                    }
                  },
                  this.filters
                ]
              }
            }
          }
        },

        aggs: {
          volume: {
            // histogram aggregation: http://www.elasticsearch.com/guide/en/elasticsearch/reference/current/search-aggregations-bucket-histogram-aggregation.html
            // date histogram aggregation: http://www.elasticsearch.com/guide/en/elasticsearch/reference/current/search-aggregations-bucket-datehistogram-aggregation.html
            date_histogram: {
              field: 'timestamp',
              min_doc_count: 0,
              interval: this.range.interval,
              extended_bounds: {
                min: this.range.start_ts,
                max: this.range.end_ts
              }
            },
            aggs: fields_aggs
          }
        }
      }
    };
  };

  /**
   * Parse the result from an ES query based on the MeasurementQuery
   * @param  {Object} result
   *                         ES query result
   * @return {Array} array of buckets
   */
  MeasurementQuery.prototype.parseResults = function (results) {
    //  buckets is an array of
    //  [{
    //   key_as_string: "2013-12-29T15:54:00.000Z",
    //   key: 1388332440000,
    //   doc_count: 1,
    //   {{fields[0]}}: { <-- first field name
    //     value: 3626992
    //   },
    //   ... <-- and so on for other fields
    // },
    // ...]
    //

    /**
     Output format must be:
     [
      {
        "id": String
        "field": String (name of the field),
        "values": [
          {
            "timestamp": Number (UTC timestamp),
            "value": String,
            // and even more fields if agg=stats
          }
        ]
      },
      ...
      ]
     */

    return results.aggregations.volume.buckets.reduce(function reduceBuckets(data, bucket) {
      this.fields.forEach(function forEachField(field) {
        // first find output data bucket
        var group = _.find(data, {
          field: field
        });


        if (!group) {
          group = {
            id: this.ids[0], // @todo handle multiple ids
            field: field,
            values: []
          };
          data.push(group);
        }

        group.values.push(_.extend({
            // `key` and rename it to `timestamp`
            timestamp: bucket.key
          },
          // each fields along with their values
          bucket[field]
        ));
      }, this);

      return data;
    }.bind(this), []);
  };

  /**
   * Create a new MeasurementQuery object from a query
   * This factory will return a PrettyError if the data are invalid
   * @param  {Express req} req
   *
   *                       req.id (string) e.g. '1419872302441'
   *                        OR
   *                       req.ids (array) e.g. ['1419872302441']
   *
   *                       req.field (string) e.g. 'used_memory'
   *                        OR
   *                       req.fields (array) e.g. ['used_memory', ..]
   *
   *                       req.agg (string) e.g. 'stats'
   *                        OR
   *                       req.aggs (array) e.g. ['stats', '
   * @param {DateRangeInterval} dateRangeInterval
   * @return {PrettyError|MeasurementQuery}
   */
  MeasurementQuery.fromReq = function (req, dateRangeInterval) {
    if (!_.isObject(req) || !req || !_.isObject(req.query)) {
      return new PrettyError(400, 'Invalid request');
    }

    if (!(dateRangeInterval instanceof DateRangeInterval)) {
      return new PrettyError(400, 'Invalid Date range interval');
    }

    if (!req.query.id && !req.query.ids) {
      return new PrettyError(400, 'id or ids must be defined');
    }

    if (!req.query.field && !req.query.fields) {
      return new PrettyError(400, 'field or fields must be defined');
    }

    req.query.ids = convertToArray(req.query.id || req.query.ids);
    req.query.fields = convertToArray(req.query.field || req.query.fields);
    req.query.aggs = convertToArray(req.query.agg || req.query.aggs);
    req.query.filters = req.query.filter || req.query.filters || '';

    if (req.query.aggs.length > 0 && req.query.aggs.length !== req.query.fields.length) {
      return new PrettyError(400, 'For each `fields` specified an aggregation type (`aggs`) must be specified');
    }

    if (req.query.aggs.length === 0) {
      // not aggs were specify fill it
      req.query.aggs = req.query.fields.map(_.partial(_.identity, MeasurementQuery.DEFAULT_AGGREGATION_TYPE));
    }

    if (!_.isString(req.query.filters)) {
      return new PrettyError(400, 'filter or filters must be a string');
    }

    try {
      req.query.filters = !_.isEmpty(req.query.filters) ? filtrES.compile(req.query.filters).query.filtered.filter : {};
    } catch (err) {
      return new PrettyError(400, 'filter or filters are invalid', err);
    }

    return _.validate(req.query, MeasurementQuery.schema.fromReq, function fallback(query) {
      return new MeasurementQuery(query.ids, query.fields, query.filters, query.aggs, dateRangeInterval);
    });
  };

  return MeasurementQuery;
};

/////////////
// Helpers //
/////////////

function convertToArray(value) {
  if (_.isString(value)) {
    return [value];
  }

  if (_.isArray(value)) {
    return value;
  }

  // invalid value
  return [];
}
