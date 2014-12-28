'use strict';
/**
 * Template value
 */
var TEMPLATE_BASE = require('../../template/monitoring.template'); // exceptional

module.exports = function (es, amqp, config) {


  /**
   * [Template description]
   * @param {Date} start_date
   * @param {Date} end_date
   * @param {String} interval
   */
  function Template() {

  }

  Template.setupTemplate = function (f) {
    var USER_DEFINED_TEMPLATE = require('../../template/monitoring.template.redsmin');;
    // Setup template
    assert(_.isString(config.elasticsearch.index.name_prefix));
    assert(_.isString(config.elasticsearch.index.document.type));

    assert(_.isNumber(config.elasticsearch.index.settings.number_of_shards));
    assert(_.isNumber(config.elasticsearch.index.settings.number_of_replicas));

    var INDEX_NAME_PREFIX = config.elasticsearch.index.name_prefix;
    var INDEX_DOCUMENT_TYPE = config.elasticsearch.index.document.type;

    var TEMPLATE = _.cloneDeep(TEMPLATE_BASE);

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
    mapping.dynamic_templates = USER_DEFINED_TEMPLATE.dynamic_templates || [];
    mapping.properties.data.properties = USER_DEFINED_TEMPLATE.data_mapping || {};
    mapping.properties.metadata.properties = USER_DEFINED_TEMPLATE.metadata_mapping || {};


    console.log(JSON.stringify(TEMPLATE, null, 2));

    // http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/indices-templates.html#delete
    es.deleteTemplate({
        id: TEMPLATE.name
      },
      function (err, body, code) {
        if (err && code !== 404) {
          return f(err);
        }

        // Create an index template that will automatically be applied to new indices created.
        es.putTemplate({
          id: TEMPLATE.name,
          body: TEMPLATE
        }, function (err, body) {
          f(err, body);
        });
      });
  };

  return Template;
};
