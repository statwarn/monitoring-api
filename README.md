# Setup

```
npm install
```

# Setup index template and document mapping

```
# edit `ELASTICSEARCH_INDEX_TEMPLATE` configuration parameter
# setup template
curl -XGET localhost:9000/internal/templates/setup
```

# API

__baseUrl: monitoring.statwarn.com/api/v1__

### POST /measurement

#### request

__param:__

```
timestamp: Number (optional)  (format ISO 8601)
id: String id
```

(json):

```
{
  id:"server-thor",
  timestamp: UTC,
  data:{
    ram: 100000, // bits
    cpu: 10, // %
    network_io: 0 // bits
  }, 
  metadata:{
    
  }
}
```

#### response

200 (OK)

#### Errors
```
Incomplete 202: request accepted but the processing hasn't been completed
Bad Request 400: missing field
Internal Error 500: Internal server error
Gateway Timeout 504: timeout
```

### GET /measurement

example of metric : instantaneous_ops_per_sec

__params:__

```
field: String (e.g. 'data.a')
fields: Strings (e.g. ['data.a', 'data.b'])
id: String (e.g '17954235-926d-47af-8547-8b094556dbd6')
ids: Strings (e.g. ['17954235-926d-47af-8547-8b094556dbd6', '33436bc1-5d55-44d8-9cb1-19d17823668c'])
start_ts: Number (UTC)
end_ts: Number (UTC)
interval: String (e.g.  year, quarter, month, week, day, hour, minute, second)
agg: String (e.g. sum, avg, min, max, count (default. avg))
aggs: Strings (e.g. ['sum', 'avg', 'min'])
```

__response__

return the metric in json format with timestamp (example of metric_name: instantaneous_ops_per_sec)

```
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
```

#### Errors

```
Bad Request 400: missing field
Internal Error 500: Internal Server Error
Gateway Timeout 504: timeout
```

### DEL /measurement

Remove every metrics related to on or more `server_ids`. This route will be called each time a user remove its account or its own server.

__params:__

```
server_ids: String (e.g. 1,2,3)
access_token: String
```

#### Errors

```
Incomplete 202: request accepted but the processing hasn't been completed
Bad Request 400: missing field
Internal Error 500: Internal server error
Gateway Timeout 504: timeout
```

### DEL /internal/removeAllData

Remove datas older than `remove_before_date`.

__params:__

```
root_token: String
remove\_before_date : Timestamp
```
