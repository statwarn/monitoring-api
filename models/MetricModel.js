'use strict';

// e.g :
// {
//     "server_id": String (mongoid)
//     "name": String (name of the metric),
//     "values": [
//       {
//         "v": String,
//         "d": String (timestamp)
//       }
//     ]
//   }
function MetricModel(server_id, name, values) {
  this.server_id = server_id ||  -1;
  this.name = name || null;
  this.values = values ||  [];
};
