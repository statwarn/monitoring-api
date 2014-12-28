'use strict';
/**
 * Template value
 */

module.exports = function (es, config, template) {
  assert(_.isString(config.elasticsearch.index.name_prefix));
  assert(_.isString(config.elasticsearch.index.document.type));

  assert(_.isNumber(config.elasticsearch.index.settings.number_of_shards));
  assert(_.isNumber(config.elasticsearch.index.settings.number_of_replicas));

  /**
   * [Template description]
   * @param {Date} start_date
   * @param {Date} end_date
   * @param {String} interval
   */
  function Template() {

  }

  Template.setupTemplate = function (f) {
    var TEMPLATE = _.cloneDeep(template.base);
    var USER_DEFINED_TEMPLATE = _.cloneDeep(template.defined);

    // Setup template
    var INDEX_NAME_PREFIX = config.elasticsearch.index.name_prefix;
    var INDEX_DOCUMENT_TYPE = config.elasticsearch.index.document.type;

    // Change template name
    TEMPLATE.template = TEMPLATE.template.replace('{{INDEX_NAME_PREFIX}}', INDEX_NAME_PREFIX);
    TEMPLATE.name = TEMPLATE.name.replace('{{INDEX_NAME_PREFIX}}', INDEX_NAME_PREFIX);

    // Change settings
    TEMPLATE.settings.number_of_replicas = config.elasticsearch.index.settings.number_of_replicas;
    TEMPLATE.settings.number_of_shards = config.elasticsearch.index.settings.number_of_shards;

    // Change document type
    var mapping = TEMPLATE.mappings['{{INDEX_DOCUMENT_TYPE}}'];
    var newMapping = {};
    newMapping[INDEX_DOCUMENT_TYPE] = mapping;
    TEMPLATE.mappings = newMapping;

    // Add user defined mapping
    mapping.dynamic_templates = mapping.dynamic_templates.concat(USER_DEFINED_TEMPLATE.dynamic_templates || []);
    mapping.properties.data.properties = USER_DEFINED_TEMPLATE.data_mapping || {};
    mapping.properties.metadata.properties = USER_DEFINED_TEMPLATE.metadata_mapping || {};

    // http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/indices-templates.html#delete
    es.indices.deleteTemplate({
        name: TEMPLATE.name
      },
      function (err, body, code) {

        if (err && code !== 404) {
          return f(err);
        }

        // Create an index template that will automatically be applied to new indices created.
        // https://github.com/elasticsearch/elasticsearch-js/blob/3df3b09d3abf140fe8446b4e19d0014cc8545117/src/lib/apis/1_3.js#L3251
        es.indices.putTemplate({
          name: TEMPLATE.name,
          body: TEMPLATE
        }, function (err, body) {
          f(err, body);
        });
      });
  };

  return Template;
};
