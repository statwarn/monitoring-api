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

- Index name : "monitoring-:server_id"
- document : stocker le JSON retourné par redis info.

PUT /_template/tmpl_monitoring

{
  "template": "monitoring-*",
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  },
  "mappings": {
    "info": {
      "_timestamp": {
        "enabled": "true",
        "path": "created_at"
      },
      "_all": {
        "enabled": "false"
      },
      "_source": {
        "enabled": "true"
      },
      "dynamic": "strict",
      "properties": {
        "server_id": {
          "type": "string",
          "index": "not_analyzed"
        },
        "created_at": {
          "type": "date",
          "index": "not_analyzed"
        },
        "metrics": {
     "type": "object",
          "properties": {
            "uptime_in_seconds": {
              "type": "date",
              "index": "not_analyzed"
            },
            "connected_clients": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "client_longest_output_list": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "client_biggest_input_buf": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "blocked_clients": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "used_memory": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "used_memory_rss": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "used_memory_peak": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "used_memory_lua": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "mem_fragmentation_ratio": {
              "type": "float",
              "index":"not_analyzed"
            },
            "rdb_changes_since_last_save": {
              "type": "date",
              "index": "not_analyzed"
            },
            "rdb_last_save_time": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "rdb_last_bgsave_time_sec": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "rdb_current_bgsave_time_sec": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "aof_rewrite_in_progress": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "aof_rewrite_scheduled": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "aof_last_rewrite_time_sec": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "aof_current_rewrite_time_sec": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "total_connections_received": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "total_commands_processed": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "instantaneous_ops_per_sec": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "rejected_connections": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "expired_keys": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "evicted_keys": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "keyspace_hits": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "keyspace_misses": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "pubsub_channels": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "pubsub_patterns": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "latest_fork_usec": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "connected_slaves": {
              "type": "integer",
              "index": "not_analyzed"
            },
            "used_cpu_sys": {
              "type": "float",
              "index": "not_analyzed"
            },
            "used_cpu_user": {
              "type": "float",
              "index": "not_analyzed"
            },
            "commands": {
              "type": "object",
              "properties": {
                "*": {
                  "properties": {
                    "calls": {
                      "type:": "integer",
                      "index": "not_analyzed"
                    },
                    "usec": {
                      "type:": "integer",
                      "index": "not_analyzed"
                    },
                    "usec_per_call": {
                      "type:": "float",
                      "index": "not_analyzed"
                    }
                  }
                }
              }
            },
            "databases": {
              "type": "object",
              "properties": {
                "*": {
                  "properties": {
                    "keys": {
                      "type": "integer",
                      "index": "not_analyzed"
                    },
                    "expires": {
                      "type": "integer",
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
}

5 shards = 3 serveurs

