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
      'start_date': {
        'title': 'date range start date',
        'description': '',
        'type': 'string',
        'format': 'date-time'
      },
      'end_date': {
        'title': 'date range start date',
        'description': '',
        'type': 'string',
        'format': 'date-time'
      }
    },
    'required': ['interval', 'start_date', 'end_date']
  }
};
