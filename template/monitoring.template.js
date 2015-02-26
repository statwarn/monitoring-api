'use strict';

module.exports = {
  "name": "{{INDEX_NAME_PREFIX}}_template",
  "template": "{{INDEX_NAME_PREFIX}}-*",
  "settings": {
    // Can be overriden by ELASTICSEARCH_INDEX_SETTINGS_NUMBER_OF_SHARDS
    "number_of_shards": 1,
    // Can be overriden by ELASTICSEARCH_INDEX_SETTINGS_NUMBER_OF_REPLICAS
    "number_of_replicas": 1
  },
  "mappings": {
    "{{INDEX_DOCUMENT_TYPE}}": {
      "_id": {
        // Each document indexed is associated with an id and a type. The _id field can be used to index just the id, and possible also store it.
        // By default it is not indexed and not stored (thus, not created).
      },
      "_timestamp": {
        "enabled": "true",
        "type": "long",
        "path": "timestamp"
      },
      "_all": {
        // The idea of the _all field is that it includes the text of one or more other fields within the document indexed. It can come very handy especially for search requests, where we want to execute a search query against the content of a document, without knowing which fields to search on. This comes at the expense of CPU cycles and index size.
        "enabled": "false"
      },
      "_source": {
        // The _source field is an automatically generated field that stores the actual JSON that was used as the indexed document. It is not indexed (searchable), just stored. When executing "fetch" requests, like get or search, the _source field is returned by default.
        "enabled": "true"
      },
      // http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/mapping-dynamic-mapping.html
      "dynamic": "strict",
      // http://www.elasticsearch.org/guide/en/elasticsearch/guide/current/custom-dynamic-mapping.html
      // With dynamic_templates, you can take complete control over the mapping that is generated for newly detected fields. You can even apply a different mapping depending on the field name or datatype.
      "dynamic_templates": [],
      "properties": {
        "timestamp": {
          "type": "date",
          "index": "not_analyzed"
        },
        "data": {
          "type": "object",
          "dynamic": true,
          "properties": {}
        },
        "metadata": {
          "type": "object",
          "dynamic": true,
          "properties": {}
        }
      }
    }
  }
};
