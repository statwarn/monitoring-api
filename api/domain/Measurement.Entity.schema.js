// http://json-schema.org/
module.exports = {
  'title': 'Measurement schema',
  'type': 'object',
  'properties': {
    'id': {
      'title': 'Measurement id',
      'description': 'The id the current measurement data should be linked to',
      'type': 'string',
      'minLength': 3,
      'maxLength': 125
    },

    'timestamp': {
      'title': 'Measurement timestamp',
      'description': 'Timestamp UTC',
      'type': 'number',
      'minimum': 0
    },

    'data': {
      'title': 'Measurement data',
      'description': '',
      'type': 'object',
      'format': 'single-level-object'
    },

    'metadata': {
      'title': 'Measurement metadata',
      'description': '',
      'type': 'object'
    }
  },
  'required': ['id', 'timestamp', 'data']
};
