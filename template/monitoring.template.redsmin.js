module.exports = {
  dynamic_templates: [{
    "string_not_analyzed": {
      "mapping": {
        "index": "not_analyzed"
      },
      "path_match": "uptime*",
      "match_mapping_type": "string"
    },
    "map_float_to_integer": {
      "path_match": "*",
      "match_mapping_type": "float",
      "mapping": {
        "type": "integer"
      }
    },
    "map_everything_to_integer": {
      "path_match": "*",
      "mapping": {
        "type": "integer",
        "index": "not_analyzed"
      }
    }
  }],

  data_mapping: {
    "uptime_in_seconds": {
      "type": "date",
      "index": "not_analyzed"
    },
    "rdb_changes_since_last_save": {
      "type": "date",
      "index": "not_analyzed"
    }
  }
};
