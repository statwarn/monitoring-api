# API

__baseUrl: monitoring.redsmin.com/api/v1__

### POST /metrics

#### request

__param:__

```
access_token: String
timestamp: Number (optional)  (format ISO 8601)
```

redis info of a server (json):

```
{
  "redis_version": "2.8.17"
  "redis_git_sha1": "00000000"
  "redis_git_dirty": "0"
  ...
}
```

#### response

200 (OK)

#### Errors
```
Incomplete 202: request accepted but the processing hasn't been completed
Bad Request 400: token missing
Unauthorized 401: wrong token
Internal Error 500: Internal server error
Gateway Timeout 504: timeout
```

### GET /metrics

example of metric : instantaneous_ops_per_sec

__params:__

```
metrics: String (e.g. a,b)
server_ids: String (e.g. 1,2,3)
access_token: String
start-date-ts: Number
end-date-ts: Number
precision: String (e.g. 1d,1h,1m)
```
__response__

return the metric in json format with timestamp (example of metric_name: instantaneous_ops_per_sec)

```
[
  {
  	"server_id": String (mongoid)
    "name": String (name of the metric),
    "values": [
      {
        "v": String,
        "d": String (timestamp)
      }
    ]
  }
]
```

#### Errors

```
Bad Request 400: token missing
Unauthorized 401: wrong token
Internal Error 500: Internal server error
Gateway Timeout 504: timeout
```

### DEL /metrics

__params:__

```
server_ids: String (e.g. 1,2,3)
access_token: String
```

#### Errors

```
Incomplete 202: request accepted but the processing hasn't been completed
Bad Request 400: token missing
Unauthorized 401: wrong token
Internal Error 500: Internal server error
Gateway Timeout 504: timeout
```
 

### DEL /internal/removeAllDatas 
remove datas older than ...

__params:__

```
route_token: String
```
