module.exports = {
  // ?aggs=stats&field=used_memory&interval=minute&start_ts=0...
  single_field_used_memory_agg_stats: {
    "took": 4,
    "timed_out": false,
    "_shards": {
      "total": 3,
      "successful": 3,
      "failed": 0
    },
    "hits": {
      "total": 347,
      "max_score": 0,
      "hits": []
    },
    "aggregations": {
      "volume": {
        "buckets": [{
          "key_as_string": "2013-12-29T15:54:00.000Z",
          "key": 1388332440000,
          "doc_count": 1,
          "used_memory": {
            "count": 1,
            "min": 3626992,
            "max": 3626992,
            "avg": 3626992,
            "sum": 3626992,
            "sum_of_squares": 13155070968064,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T15:55:00.000Z",
          "key": 1388332500000,
          "doc_count": 1,
          "used_memory": {
            "count": 1,
            "min": 3177480,
            "max": 3177480,
            "avg": 3177480,
            "sum": 3177480,
            "sum_of_squares": 10096379150400,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T15:56:00.000Z",
          "key": 1388332560000,
          "doc_count": 1,
          "used_memory": {
            "count": 1,
            "min": 1197328496,
            "max": 1197328496,
            "avg": 1197328496,
            "sum": 1197328496,
            "sum_of_squares": 1433595527333622000,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T15:57:00.000Z",
          "key": 1388332620000,
          "doc_count": 1,
          "used_memory": {
            "count": 1,
            "min": 14033800,
            "max": 14033800,
            "avg": 14033800,
            "sum": 14033800,
            "sum_of_squares": 196947542440000,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T15:58:00.000Z",
          "key": 1388332680000,
          "doc_count": 0,
          "used_memory": {
            "count": 0,
            "min": null,
            "max": null,
            "avg": null,
            "sum": null,
            "sum_of_squares": null,
            "variance": null,
            "std_deviation": null
          }
        }, {
          "key_as_string": "2013-12-29T15:59:00.000Z",
          "key": 1388332740000,
          "doc_count": 1,
          "used_memory": {
            "count": 1,
            "min": 40013264,
            "max": 40013264,
            "avg": 40013264,
            "sum": 40013264,
            "sum_of_squares": 1601061295933696,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T16:00:00.000Z",
          "key": 1388332800000,
          "doc_count": 0,
          "used_memory": {
            "count": 0,
            "min": null,
            "max": null,
            "avg": null,
            "sum": null,
            "sum_of_squares": null,
            "variance": null,
            "std_deviation": null
          }
        }, {
          "key_as_string": "2013-12-29T16:01:00.000Z",
          "key": 1388332860000,
          "doc_count": 0,
          "used_memory": {
            "count": 0,
            "min": null,
            "max": null,
            "avg": null,
            "sum": null,
            "sum_of_squares": null,
            "variance": null,
            "std_deviation": null
          }
        }]
      }
    }
  },
  // ?aggs=avg&aggs=stats&field=used_memory&field=used_memory_rss&interval=minute&start_ts=0...
  multiple_fields_used_memory_and_used_memory_rss_agg_avg_and_stats: {
    "took": 5,
    "timed_out": false,
    "_shards": {
      "total": 3,
      "successful": 3,
      "failed": 0
    },
    "hits": {
      "total": 347,
      "max_score": 0,
      "hits": []
    },
    "aggregations": {
      "volume": {
        "buckets": [{
          "key_as_string": "2013-12-29T15:54:00.000Z",
          "key": 1388332440000,
          "doc_count": 1,
          "used_memory": {
            "value": 3626992
          },
          "used_memory_rss": {
            "count": 1,
            "min": 2912256,
            "max": 2912256,
            "avg": 2912256,
            "sum": 2912256,
            "sum_of_squares": 8481235009536,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T15:55:00.000Z",
          "key": 1388332500000,
          "doc_count": 1,
          "used_memory": {
            "value": 3177480
          },
          "used_memory_rss": {
            "count": 1,
            "min": 3177480,
            "max": 3177480,
            "avg": 3177480,
            "sum": 3177480,
            "sum_of_squares": 10096379150400,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T15:56:00.000Z",
          "key": 1388332560000,
          "doc_count": 1,
          "used_memory": {
            "value": 1197328496
          },
          "used_memory_rss": {
            "count": 1,
            "min": 1225158656,
            "max": 1225158656,
            "avg": 1225158656,
            "sum": 1225158656,
            "sum_of_squares": 1501013732371726300,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T15:57:00.000Z",
          "key": 1388332620000,
          "doc_count": 1,
          "used_memory": {
            "value": 14033800
          },
          "used_memory_rss": {
            "count": 1,
            "min": 14033800,
            "max": 14033800,
            "avg": 14033800,
            "sum": 14033800,
            "sum_of_squares": 196947542440000,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T15:58:00.000Z",
          "key": 1388332680000,
          "doc_count": 0,
          "used_memory": {
            "value": null
          },
          "used_memory_rss": {
            "count": 0,
            "min": null,
            "max": null,
            "avg": null,
            "sum": null,
            "sum_of_squares": null,
            "variance": null,
            "std_deviation": null
          }
        }, {
          "key_as_string": "2013-12-29T15:59:00.000Z",
          "key": 1388332740000,
          "doc_count": 1,
          "used_memory": {
            "value": 40013264
          },
          "used_memory_rss": {
            "count": 1,
            "min": 49119232,
            "max": 49119232,
            "avg": 49119232,
            "sum": 49119232,
            "sum_of_squares": 2412698952269824,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T16:00:00.000Z",
          "key": 1388332800000,
          "doc_count": 0,
          "used_memory": {
            "value": null
          },
          "used_memory_rss": {
            "count": 0,
            "min": null,
            "max": null,
            "avg": null,
            "sum": null,
            "sum_of_squares": null,
            "variance": null,
            "std_deviation": null
          }
        }, {
          "key_as_string": "2013-12-29T16:01:00.000Z",
          "key": 1388332860000,
          "doc_count": 0,
          "used_memory": {
            "value": null
          },
          "used_memory_rss": {
            "count": 0,
            "min": null,
            "max": null,
            "avg": null,
            "sum": null,
            "sum_of_squares": null,
            "variance": null,
            "std_deviation": null
          }
        }, {
          "key_as_string": "2013-12-29T16:02:00.000Z",
          "key": 1388332920000,
          "doc_count": 1,
          "used_memory": {
            "value": 3230648
          },
          "used_memory_rss": {
            "count": 1,
            "min": 2609152,
            "max": 2609152,
            "avg": 2609152,
            "sum": 2609152,
            "sum_of_squares": 6807674159104,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T16:03:00.000Z",
          "key": 1388332980000,
          "doc_count": 1,
          "used_memory": {
            "value": 3527064
          },
          "used_memory_rss": {
            "count": 1,
            "min": 3527064,
            "max": 3527064,
            "avg": 3527064,
            "sum": 3527064,
            "sum_of_squares": 12440180460096,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T16:04:00.000Z",
          "key": 1388333040000,
          "doc_count": 0,
          "used_memory": {
            "value": null
          },
          "used_memory_rss": {
            "count": 0,
            "min": null,
            "max": null,
            "avg": null,
            "sum": null,
            "sum_of_squares": null,
            "variance": null,
            "std_deviation": null
          }
        }, {
          "key_as_string": "2013-12-29T16:05:00.000Z",
          "key": 1388333100000,
          "doc_count": 1,
          "used_memory": {
            "value": 25079536
          },
          "used_memory_rss": {
            "count": 1,
            "min": 27361280,
            "max": 27361280,
            "avg": 27361280,
            "sum": 27361280,
            "sum_of_squares": 748639643238400,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T16:06:00.000Z",
          "key": 1388333160000,
          "doc_count": 1,
          "used_memory": {
            "value": 3172621
          },
          "used_memory_rss": {
            "count": 1,
            "min": 3172621,
            "max": 3172621,
            "avg": 3172621,
            "sum": 3172621,
            "sum_of_squares": 10065524009641,
            "variance": 0,
            "std_deviation": 0
          }
        }, {
          "key_as_string": "2013-12-29T16:07:00.000Z",
          "key": 1388333220000,
          "doc_count": 0,
          "used_memory": {
            "value": null
          },
          "used_memory_rss": {
            "count": 0,
            "min": null,
            "max": null,
            "avg": null,
            "sum": null,
            "sum_of_squares": null,
            "variance": null,
            "std_deviation": null
          }
        }]
      }
    }
  }
};
