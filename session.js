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

  setRandomAdventures(
    activity,
    location,
    short_desc,
    price,
    poi,
    website,
    imageURL
  ) {
    activity.forEach(act => {
      redis.LPUSH("cachedActivity", act);
    });
    location.forEach(loc => {
      redis.LPUSH("cachedLocation", loc);
    });
    short_desc.forEach(desc => {
      redis.LPUSH("cachedShort_desc", desc);
    });
    price.forEach(pr => {
      redis.LPUSH("cachedPrice", pr);
    });
    poi.forEach(p => {
      redis.LPUSH("cachedPoi", p);
    });
    website.forEach(site => {
      redis.LPUSH("cachedWebsite", site);
    });
    imageURL.forEach(url => {
      redis.LPUSH("cachedImageURL", url);
    });
  }

  getRandomAdventures() {
    return redis
      .multi()
      .lrange("cachedActivity", 0, 0)
      .lrange("cachedLocation", 0, 0)
      .lrange("cachedShort_desc", 0, 0)
      .lrange("cachedPrice", 0, 0)
      .lrange("cachedPoi", 0, 0)
      .lrange("cachedWebsite", 0, 0)
      .lrange("cachedImageURL", 0, 0)
      .ltrim("cachedActivity", 1, -1)
      .ltrim("cachedLocation", 1, -1)
      .ltrim("cachedShort_desc", 1, -1)
      .ltrim("cachedPrice", 1, -1)
      .ltrim("cachedPoi", 1, -1)
      .ltrim("cachedWebsite", 1, -1)
      .ltrim("cachedImageURL", 1, -1)
      .execAsync()
      .then(function(res) {
        console.log(res);
        return res;
      });

    // return (
    //   redis.lrangeAsync("cachedActivity", 0, 0).then(function(act) {
    //     return act;
    //   }),
    //   redis.lrangeAsync("cachedLocation", 0, 0).then(function(loc) {
    //     return loc;
    //   }),
    //   redis.lrangeAsync("cachedShort_desc", 0, 0).then(function(desc) {
    //     return desc;
    //   }),
    //   redis.lrangeAsync("cachedPrice", 0, 0).then(function(pr) {
    //     return pr;
    //   }),
    //   redis.lrangeAsync("cachedPoi", 0, 0).then(function(p) {
    //     return p;
    //   }),
    //   redis.lrangeAsync("cachedWebsite", 0, 0).then(function(site) {
    //     return site;
    //   }),
    //   redis.lrangeAsync("cachedImageURL", 0, 0).then(function(url) {
    //     return url;
    //   })
    // );
  }
}
module.exports = Session;

//redis://redistogo:8ea37dd6493bf8b88c4f18ed0247240a@hammerjaw.redistogo.com:10191/
