# API

__baseUrl: monitoring.redsmin.com/api/v1__

### POST /servers/:server_id

#### request

__param:__

```
token: String
```

redis info of a server (json):

```
{
  "redis_version": 2.8.17
  "redis_git_sha1": 00000000
  "redis_git_dirty": 0
  ...
}
```

#### response

200 (OK)

#### Errors
```
Bad Request 400 : token missing
Unauthorized 401 : wrong token
Internal Error 500 : Internal server error
Gateway Timeout 504 : timeout
```

### GET /servers/:server_id/metrics

__params:__

```
token: String,
fields: String,
key: String,
minutes: Number
```
__response__

(json)

```
[
  {
    "ts": Number, metric: Number
  },
  ...
]
```

#### Errors

```
Bad Request 400 : token missing
Unauthorized 401 : wrong token
Internal Error 500 : Internal server error
Gateway Timeout 504 : timeout
```
