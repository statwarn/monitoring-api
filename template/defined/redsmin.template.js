module.exports = {
  // http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/mapping-root-object-type.html
  //
  dynamic_templates: [{
    "tpl_never_analyze": {
      "path_match": "data.*", // we don't set "*" because we don't have metadata in redsmin
      "mapping": {
        // Index this field, so it is searchable, but index the value exactly as specified. Do not analyze it.
        "index": "not_analyzed"
      }
    }
  }],

  data_mapping: {}
};
