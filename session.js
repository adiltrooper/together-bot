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
      console.log("SOMETHING WRONG WITH REDIS");
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
      console.log(res);
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

  delDraftImage() {
    redis.del("draftImage");
  }

  delDraftCaption() {
    redis.del("draftCaption");
  }

  setCachedListings(
    cat_id,
    activity,
    location,
    short_desc,
    price,
    poi,
    website,
    imageURL
  ) {
    switch (cat_id) {
      case 1:
        var cat = "Adventurous";
        break;
      case 2:
        var cat = "Chill";
        break;
      case 3:
        var cat = "Home";
    }

    activity.forEach(act => {
      redis.LPUSH(`cachedActivity_${cat}`, act);
    });
    location.forEach(loc => {
      redis.LPUSH(`cachedLocation_${cat}`, loc);
    });
    short_desc.forEach(desc => {
      redis.LPUSH(`cachedShort_desc_${cat}`, desc);
    });
    price.forEach(pr => {
      redis.LPUSH(`cachedPrice_${cat}`, pr);
    });
    poi.forEach(p => {
      redis.LPUSH(`cachedPoi_${cat}`, p);
    });
    website.forEach(site => {
      redis.LPUSH(`cachedWebsite_${cat}`, site);
    });
    imageURL.forEach(url => {
      redis.LPUSH(`cachedImageURL_${cat}`, url);
    });
  }

  getCachedAdventurous() {
    return redis
      .multi()
      .lrange("cachedActivity_Adventurous", 0, 0)
      .lrange("cachedLocation_Adventurous", 0, 0)
      .lrange("cachedShort_desc_Adventurous", 0, 0)
      .lrange("cachedPrice_Adventurous", 0, 0)
      .lrange("cachedPoi_Adventurous", 0, 0)
      .lrange("cachedWebsite_Adventurous", 0, 0)
      .lrange("cachedImageURL_Adventurous", 0, 0)
      .ltrim("cachedActivity_Adventurous", 1, -1)
      .ltrim("cachedLocation_Adventurous", 1, -1)
      .ltrim("cachedShort_desc_Adventurous", 1, -1)
      .ltrim("cachedPrice_Adventurous", 1, -1)
      .ltrim("cachedPoi_Adventurous", 1, -1)
      .ltrim("cachedWebsite_Adventurous", 1, -1)
      .ltrim("cachedImageURL_Adventurous", 1, -1)
      .execAsync()
      .then(function(res) {
        console.log(res);
        return res;
      });
  }

  getCachedChill() {
    return redis
      .multi()
      .lrange("cachedActivity_Chill", 0, 0)
      .lrange("cachedLocation_Chill", 0, 0)
      .lrange("cachedShort_desc_Chill", 0, 0)
      .lrange("cachedPrice_Chill", 0, 0)
      .lrange("cachedPoi_Chill", 0, 0)
      .lrange("cachedWebsite_Chill", 0, 0)
      .lrange("cachedImageURL_Chill", 0, 0)
      .ltrim("cachedActivity_Chill", 1, -1)
      .ltrim("cachedLocation_Chill", 1, -1)
      .ltrim("cachedShort_desc_Chill", 1, -1)
      .ltrim("cachedPrice_Chill", 1, -1)
      .ltrim("cachedPoi_Chill", 1, -1)
      .ltrim("cachedWebsite_Chill", 1, -1)
      .ltrim("cachedImageURL_Chill", 1, -1)
      .execAsync()
      .then(function(res) {
        console.log(res);
        return res;
      });
  }

  getCachedHome() {
    return redis
      .multi()
      .lrange("cachedActivity_Home", 0, 0)
      .lrange("cachedLocation_Home", 0, 0)
      .lrange("cachedShort_desc_Home", 0, 0)
      .lrange("cachedPrice_Home", 0, 0)
      .lrange("cachedPoi_Home", 0, 0)
      .lrange("cachedWebsite_Home", 0, 0)
      .lrange("cachedImageURL_Home", 0, 0)
      .ltrim("cachedActivity_Home", 1, -1)
      .ltrim("cachedLocation_Home", 1, -1)
      .ltrim("cachedShort_desc_Home", 1, -1)
      .ltrim("cachedPrice_Home", 1, -1)
      .ltrim("cachedPoi_Home", 1, -1)
      .ltrim("cachedWebsite_Home", 1, -1)
      .ltrim("cachedImageURL_Home", 1, -1)
      .execAsync()
      .then(function(res) {
        console.log(res);
        return res;
      });
  }
}
module.exports = Session;

//redis://redistogo:8ea37dd6493bf8b88c4f18ed0247240a@hammerjaw.redistogo.com:10191/
