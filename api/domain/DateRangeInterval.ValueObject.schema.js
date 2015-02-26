// http://json-schema.org/
module.exports = {
  req: {
    'title': 'fromReq Schema',
    'type': 'object',

    'properties': {
      'interval': {
        'title': 'Metric interval',
        'description': 'Interval',
        'type': 'string',
        'format': 'enum',
        'values': ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second']
      },
      'start_ts': {
        'title': 'date range start date',
        'description': '',
        'type': 'number'
      },
      'end_ts': {
        'title': 'date range end date',
        'description': '',
        'type': 'number'
      }
    },
    'required': ['interval', 'start_ts', 'end_ts']
  }
};
