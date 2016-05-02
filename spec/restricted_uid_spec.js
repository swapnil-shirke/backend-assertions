// var frisby = require('frisby');
// var config = require('../config/conf.js');
// var built = require('../config/endpoints.js');

// //console.log(frisby)


// var url = config.host+'/'+config.version;


// /*var frisby = require('frisby');
// // GlobalConfiguration
// frisby.globalSetup({
//   request: {
//     headers: {
//       'WEB_UI_API_KEY': '607a456d7f3afc20cd9fcb1f'
//     },
//     inspectOnFailure: true,
//     json: true,
//   }
// });

// */

// frisby.create('built.io application users - GET')
//   .get(url+built.restricted_uids)
//   .expectStatus(200)
//   .expectHeader('x-powered-by', 'built.io')
//   .expectHeader('Content-Type', 'application/json')
//   .expectHeaderContains('x-runtime', 'ms')
//   //.expectHeaderContains('content-length', '462')
//   .expectMaxResponseTime('3000', '0')
//   .expectJSONLength('restricted', 42)
//   .expectJSON({
//     "restricted": [
//       "_posts",
//       "_pres",
//       "_events",
//       "emit",
//       "toObject",
//       "collection",
//       "modelName",
//       "options",
//       "schema",
//       "errors",
//       "isNew",
//       "init",
//       "get",
//       "set",
//       "db",
//       "on",
//       "id",
//       "published",
//       "uid",
//       "created_at",
//       "deleted_at",
//       "updated_at",
//       "tags_array",
//       "klass_id",
//       "applikation_id",
//       "*_ids",
//       "id",
//       "_id",
//       "ACL",
//       "SYS_ACL",
//       "DEFAULT_ACL",
//       "app_user_object_uid",
//       "built_io_upload",
//       "__loc",
//       "tags",
//       "_owner",
//       "_version",
//       "toJSON",
//       "save",
//       "update",
//       "domain",
//       "shard_account",
//       "shard_app",
//       "shard_random",
//       "hook"
//     ]
//   })
//   .inspectRequest()
//   .inspectResponse()
//   .inspectJSON()
//   //.inspectBody()
//   //.inspectHeaders()
//   .afterJSON(function (body) {
//     expect(body.restricted[0]).not.toBe(undefined);
//     global.resp_array = body.restricted[0];
//     console.log('>>> Key used for test: ', global.resp_array)
//     //save key for future use
//     global.id = Object.keys(body)[0];
//     console.log('>>> Key used for test: ', global.id);
//   })
// .toss()
