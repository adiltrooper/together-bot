const keys = require("./config_keys/keys");
var redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis);

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
    return redis.setex("adminsId", 3600, adminsId);
  }

  setAdminStateNull() {
    return redis.del("adminsState");
  }

  setAdminState() {
    return redis.setex("adminState", 3600, "admin1");
  }

  setAdminState2() {
    return redis.setex("adminState", 3600, "admin2");
  }

  setAdminState3() {
    return redis.setex("adminState", 3600, "admin3");
  }

  getAdminState() {
    return redis.getAsync("adminState").then(function(res) {
      return res;
    });
  }

  getAdminList() {
    return redis.getAsync("adminsId").then(function(res) {
      return res;
    });
  }

  setUserSendList(userArray) {
    redis.setex("userSendList", 1200, userArray);
  }
  getUserSendList() {
    return redis.getAsync("userSendList").then(function(res) {
      return res;
    });
  }

  setDraftImage(imageId) {
    redis.setex("draftImage", 1200, imageId);
  }

  setDraftCaption(caption) {
    redis.setex("draftCaption", 1200, caption);
  }

  getDraftImage() {
    return redis.getAsync("draftImage").then(function(res) {
      return res;
    });
  }

  getDraftCaption() {
    return redis.getAsync("draftCaption").then(function(res) {
      return res;
    });
  }

  setRandomAdventurous(results) {
    results.map(result => {
      redis.LPUSH("randomAdvTempArray", 3600, result);
    });
  }
  // async getAdminList() {
  //   const res = await getAsync("adminsId");
  //   console.log(res);
  // }
}
module.exports = Session;

//redis://redistogo:8ea37dd6493bf8b88c4f18ed0247240a@hammerjaw.redistogo.com:10191/
