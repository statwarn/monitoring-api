# Schema

- Index
    + Document

- Index name : "monitoring-:server_id"
- Document : stocker le JSON retourné par info.

    -> analyzer/schéma

# Document in :

{
    "redsmin_version":"129.12"
}

# Analyzer

"content": {
    "type": "string",
    "index": "analyzed",
    "analyzer": "social_analyzer",
    "fields": {
        "urls": {
            "type": "string",
            "index": "analyzed",
            "analyzer": "url_analyzer"
        }
    }
},


PUT /_template/tmpl_monitoring

```
{
    "template" : "monitoring-*",
    "settings" : {
        "number_of_shards": 5, // <-- à modifier 
        "number_of_replicas": 1 
    },
    "mappings": {
        "info": { // <-- type de mapping (à envoyer au moment de l'insertion dans ES)
          "_timestamp": {
            "enabled": "true",
            "path": "generic.created_at" // <- à modifier
          },
          "_id": {
            "index": "not_analyzed",
            "store": "false",
            "path": "generic.id"
          },
          "_all": {
            "enabled": "false"
          },
          "_source": {
            "enabled": "true"
          },
          "dynamic": "true",
          "properties": {
            "generic": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "index": "not_analyzed"
                },
                "type": {
                  "type": "string",
                  "index": "not_analyzed"
                },
                "title": {
                  "type": "string",
                  "index": "analyzed",
                  "index_analyzer": "social_analyzer",
                  "search_analyzer": "search_social_analyzer",
                  "norms": {
                    "enabled": false
                  }
                },
                "content": {
                  "type": "string",
                  "index": "analyzed",
                  "index_analyzer": "social_analyzer",
                  "search_analyzer": "search_social_analyzer",
                  "norms": {
                    "enabled": false
                  },
                  "fields": {
                    "urls": {
                      "type": "string",
                      "index": "analyzed",
                      "analyzer": "url_analyzer",
                      "store": "yes",
                      "norms": {
                        "enabled": false
                      }
                    }
                  }
                },
                "content_truncated": {
                  "type": "string",
                  "index": "analyzed",
                  "analyzer": "tag_analyzer",
                  "norms": {
                    "enabled": false
                  }
                },
                "source": {
                  "type": "string",
                  "index": "not_analyzed"
                },
                "geo": {
                  "type": "geo_point",
                  "lat_lon": "true",
                  "fielddata": {
                    "format": "compressed",
                    "precision": "1km"
                  },
                  "geohash": true,
                  "geohash_prefix": true,
                  "geohash_precision": 10
                },
                "link": {
                  "type": "string",
                  "index": "no"
                },
                "lang": {
                  "type": "string",
                  "index": "not_analyzed"
                },
                "created_at": {
                  "type": "date",
                  "index": "not_analyzed"
                },
                "sentiment": {
                  "type": "string",
                  "index": "not_analyzed"
                },
                "author": {
                  "type": "object",
                  "properties": {
                    "username": {
                      "type": "string",
                      "index": "not_analyzed"
                    },
                    "name": {
                      "type": "string",
                      "index": "not_analyzed"
                    },
                    "id": {
                      "type": "string",
                      "index": "not_analyzed"
                    },
                    "avatar": {
                      "type": "string",
                      "index": "no"
                    },
                    "link": {
                      "type": "string",
                      "index": "no"
                    }
                  }
                }
              }
            },
            "twitter_source": {
              "type": "object",
              "properties": {
                "author": {
                  "type": "object",
                  "properties": {
                    "followers_count": {
                      "type": "long"
                    },
                    "description": {
                      "type": "string",
                      "index": "analyzed",
                      "index_analyzer": "social_analyzer",
                      "search_analyzer": "search_social_analyzer",
                      "norms": {
                        "enabled": false
                      }
                    }
                  }
                },
                "retweeted_status": {
                  "type": "object",
                  "properties": {
                    "id_str": {
                      "type": "string",
                      "index": "not_analyzed"
                    },
                    "retweet_count": {
                      "type": "long"
                    },
                    "user": {
                      "type": "object",
                      "properties": {
                        "screen_name": {
                          "type": "string",
                          "index": "not_analyzed"
                        },
                        "name": {
                          "type": "string",
                          "index": "not_analyzed"
                        },
                        "id_str": {
                          "type": "string",
                          "index": "not_analyzed"
                        },
                        "profile_image_url": {
                          "type": "string",
                          "index": "no"
                        }
                      }
                    }
                  }
                },
                "user_mentions": {
                  "properties": {
                    "screen_name": {
                      "type": "string",
                      "index": "not_analyzed"
                    },
                    "name": {
                      "type": "string",
                      "index": "not_analyzed"
                    },
                    "id_str": {
                      "type": "string",
                      "index": "not_analyzed"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
}
```

5 shards = 3 serveurs

