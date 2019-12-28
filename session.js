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
    return redis.setex("adminState", 1200, "admin1");
  }

  setAdminState2() {
    return redis.setex("adminState", 1200, "admin2");
  }

  setAdminState3() {
    return redis.setex("adminState", 1200, "admin3");
  }
  setAdminState4() {
    return redis.setex("adminState", 1200, "admin4");
  }
  setAdminState5() {
    return redis.setex("adminState", 1200, "admin5");
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
    redis.setAsync("userSendList", userArray).then(function(res) {
      console.log("userSendList IS SET");
    });
  }
  getUserSendList() {
    return redis.getAsync("userSendList").then(function(res) {
      console.log("getting");
      return res;
    });
  }

  setDraftImage(imageId) {
    redis.setAsync("draftImage", imageId).then(function(res) {
      console.log("DRAFT IMAGE IN");
    });
  }

  setDraftCaption(caption) {
    redis.setAsync("draftCustomCaption", caption).then(function(res) {
      console.log("DRAFT CAPTION IN");
    });
  }

  setDraftCustomImage(imageId) {
    redis.setAsync("draftCustomImage", imageId).then(function(res) {
      console.log("DRAFT IMAGE IN");
    });
  }

  setDraftCustomCaption(caption) {
    redis.setAsync("draftCustomCaption", caption).then(function(res) {
      console.log("DRAFT CAPTION IN");
    });
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

  getDraftCustomImage() {
    return redis.getAsync("draftCustomImage").then(function(res) {
      return res;
    });
  }

  getDraftCustomCaption() {
    return redis.getAsync("draftCustomCaption").then(function(res) {
      return res;
    });
  }

  setDraftMessage(message) {
    redis.setAsync("draftMessage", message).then(function(res) {
      console.log("DRAFT MESSAGE IN");
    });
  }

  setPollMessage(message) {
    redis.hsetAsync("currentPoll", "message", message).then(function(res) {
      return res;
    });
  }

  setPollData(title, option1, option2, option3, option4) {
    switch ((option1, option2, option3, option4)) {
      case (option1, !option2, !option3, !option4):
        redis
          .hsetAsync("currentPoll", "title", title, "option1", option1)
          .then(function(res) {
            return res;
          });
        break;
      case (option1, option2, !option3, !option4):
        redis
          .hsetAsync(
            "currentPoll",
            "title",
            title,
            "option1",
            option1,
            "option2",
            option2
          )
          .then(function(res) {
            return res;
          });
        break;
      case (option1, option2, option3, !option4):
        redis
          .hsetAsync(
            "currentPoll",
            "title",
            title,
            "option1",
            option1,
            "option2",
            option2,
            "option3",
            option3
          )
          .then(function(res) {
            return res;
          });
        break;
      case (option1, option2, option3, option4):
        redis
          .hsetAsync(
            "currentPoll",
            "title",
            title,
            "option1",
            option1,
            "option2",
            option2,
            "option3",
            option3,
            "option4",
            option4
          )
          .then(function(res) {
            return res;
          });
        break;
      default:
        redis
          .hsetAsync("currentPoll", "title", title, "option1", option1)
          .then(function(res) {
            return res;
          });
    }
  }

  getPollMessage() {
    return redis.hgetAsync("currentPoll", "message").then(function(res) {
      return res;
    });
  }

  setDraftCustomMessage(message) {
    redis.setAsync("draftCustomMessage", message).then(function(res) {
      console.log("DRAFT MESSAGE IN");
    });
  }

  setDraftCustomTitle(title) {
    redis.setAsync("draftCustomTitle", title).then(function(res) {
      return res;
    });
  }

  getDraftCustomTitle() {
    return redis.getAsync("draftCustomTitle").then(function(res) {
      return res;
    });
  }

  getDraftMessage() {
    return redis.getAsync("draftMessage").then(function(res) {
      return res;
    });
  }

  getDraftCustomMessage() {
    return redis.getAsync("draftCustomMessage").then(function(res) {
      return res;
    });
  }

  delPollData() {
    return redis.del("currentPoll");
  }

  setCustomOptions(option1, option2, option3, option4) {
    if (option1 && !option2 && !option3 && !option4) {
      return redis.RPUSH("customOptions", option1);
    } else if (option1 && option2 && !option3 && !option4) {
      return redis.RPUSH("customOptions", [option1, option2]);
    } else if (option1 && option2 && option3 && !option4) {
      return redis.RPUSH("customOptions", [option1, option2, option3]);
    } else if (option1 && option2 && option3 && option4) {
      return redis.RPUSH("customOptions", [option1, option2, option3, option4]);
    }
  }

  getCustomOptions() {
    return redis
      .multi()
      .LRANGE("customOptions", 0, 3)
      .execAsync()
      .then(function(res) {
        console.log(res);
        return res;
      });
  }

  setPollReplyOption1(userId) {
    redis.LPUSH("option1voter", userId);
  }
  setPollReplyOption2(userId) {
    redis.LPUSH("option2voter", userId);
  }
  setPollReplyOption3(userId) {
    redis.LPUSH("option3voter", userId);
  }
  setPollReplyOption4(userId) {
    redis.LPUSH("option4voter", userId);
  }
  getPollReplyOption1() {
    return redis
      .multi()
      .LRANGE("option1voter", 0, -1)
      .execAsync()
      .then(function(res) {
        console.log(res);
        return res;
      });
  }

  getPollReplyOption2() {
    return redis
      .multi()
      .LRANGE("option2voter", 0, -1)
      .execAsync()
      .then(function(res) {
        console.log(res);
        return res;
      });
  }

  getPollReplyOption3() {
    return redis
      .multi()
      .LRANGE("option3voter", 0, -1)
      .execAsync()
      .then(function(res) {
        console.log(res);
        return res;
      });
  }

  getPollReplyOption4() {
    return redis
      .multi()
      .LRANGE("option4voter", 0, -1)
      .execAsync()
      .then(function(res) {
        console.log(res);
        return res;
      });
  }

  delPollReplyOption1() {
    return redis.del("option1voter");
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
