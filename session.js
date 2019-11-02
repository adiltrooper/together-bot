const keys = require("./config_keys/keys");

class Session {
  constructor() {
    if (process.env.REDISTOGO_URL) {
      console.log("YES");
      var rtg = require("url").parse(process.env.REDISTOGO_URL);
      var redis = require("redis").createClient(rtg.port, rtg.hostname);

      redis.auth(rtg.auth.split(":")[1]);
    } else {
      const redis = require("redis").createClient(keys.redisPort);
    }
    console.log("Client creating!");
  }

  setAdminList() {
    const adminsId = keys.adminsId;
    return redis.setex(adminsId, 3600, adminsId);
  }
}

module.exports = Session;

//redis://redistogo:8ea37dd6493bf8b88c4f18ed0247240a@hammerjaw.redistogo.com:10191/
