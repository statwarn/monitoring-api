'use strict';
// http://json-schema.org/

var AGGREGATION_TYPES = ['avg', 'min', 'max', 'sum', 'count', 'stats'];

module.exports = {
  AGGREGATION_TYPES: AGGREGATION_TYPES,
  fromReq: {
    'title': 'fromReq Schema',
    'type': 'object',
    'properties': {
      'ids': {
        'title': 'metric id(s) to fetch',
        'description': '',
        'type': 'array',
        'additionalItems': false,
        'required': true,
        'items': {
          'type': ['string']
        }
      },
      'fields': {
        'title': 'field(s) to fetch',
        'description': '',
        'type': 'array',
        'additionalItems': false,
        'required': true,
        'items': {
          'type': ['string']
        }
      },
      'aggs': {
        'title': 'aggregations type',
        'description': '',
        'type': 'array',
        'additionalItems': false,
        'required': true,
        'items': {
          'type': 'string',
          'format': 'enum',
          'values': AGGREGATION_TYPES
        }
      }
    }
  }
};
