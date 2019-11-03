const keys = require("./config_keys/keys");
var redis = require("redis");
const { promisify } = require("util");
const getAsync = promisify(redis.get).bind(redis);

class Session {
  constructor() {
    if (process.env.REDISTOGO_URL) {
      console.log("YES");
      var rtg = require("url").parse(process.env.REDISTOGO_URL);
      redis = redis.createClient(rtg.port, rtg.hostname);

      redis.auth(rtg.auth.split(":")[1]);
    } else {
      redis = require("redis").createClient(keys.redisPort);
    }
  }

  setAdminList() {
    const adminsId = keys.adminsId;
    console.log("information has been set");
    return redis.setex("adminsId", 3600, adminsId);
  }

  setEnterAdminState() {
    redis.setex("adminState", 3600, "admin1");
  }

  getAdminState() {
    redis.get("adminState", (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data !== null) {
        return data;
      }
    });
  }

  getAdminList() {
    return getAsync("adminsId").then(function(res) {
      console.log(res); // => 'bar'
    });
  }

  // async getAdminList() {
  //   const res = await getAsync("adminsId");
  //   console.log(res);
  // }
}

module.exports = Session;

//redis://redistogo:8ea37dd6493bf8b88c4f18ed0247240a@hammerjaw.redistogo.com:10191/
