const keys = require("./config_keys/keys");
var redis = require("redis");

class Session {
  constructor() {
    if (process.env.REDISTOGO_URL) {
      console.log("YES");
      var rtg = require("url").parse(process.env.REDISTOGO_URL);
      this.redis = this.redis.createClient(rtg.port, rtg.hostname);

      this.redis.auth(rtg.auth.split(":")[1]);
    } else {
      this.redis = require("redis").createClient(keys.redisPort);
    }
  }

  setAdminList() {
    const adminsId = keys.adminsId;
    return this.redis.setex(adminsId, 3600, adminsId);
  }
}

module.exports = Session;

//redis://redistogo:8ea37dd6493bf8b88c4f18ed0247240a@hammerjaw.redistogo.com:10191/
