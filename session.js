// const keys = require("./config_keys/keys");
// const redis = require("redis");
//
// class Session {
//   constructor() {
//     const client = redis.createClient(keys.redisPort);
//   }
//
//   setAdminList() {
//     const adminsId = keys.adminsId;
//     return client.setex(adminsId, 3600, adminsId);
//   }
// }
//
// module.exports = Session;
