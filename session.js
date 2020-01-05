const keys = require("./config/config_keys/keys");
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

  setAdminState(state) {
    return redis.setex("adminState", 1200, `admin${state}`);
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
      console.log("UserList Set");
      return res;
    });
  }

  setDraftImage(imageId) {
    redis.setAsync("draftImage", imageId).then(function(res) {
      console.log("DRAFT IMAGE IN");
    });
  }

  getDraftImage() {
    return redis.getAsync("draftImage").then(function(res) {
      return res;
    });
  }

  delDraftImage() {
    redis.del("draftImage");
    return console.log("DELETED IMAGE");
  }

  setDraftMessage(message) {
    redis.setAsync("draftMessage", message).then(function(res) {
      console.log("DRAFT MESSAGE IN");
    });
  }

  getDraftMessage() {
    return redis.getAsync("draftMessage").then(function(res) {
      return res;
    });
  }

  delDraftMessage() {
    redis.del("draftMessage");
    return console.log("DELETED MESSAGE");
  }

  setPollMessage(message) {
    redis.hset("Poll:currentPoll", "message", message, function(err, res) {
      if (err) console.log(err);
    });
  }

  getPollMessage() {
    return redis.hgetAsync("Poll:currentPoll", "message").then(function(res) {
      return res;
    });
  }

  setPollImage(imageId) {
    redis.hset("Poll:currentPoll", "image", imageId),
      function(err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log("Poll Image In");
        }
      };
  }

  getPollImage() {
    return redis.hgetAsync("Poll:currentPoll", "image").then(function(res) {
      return res;
    });
  }

  setPollData(title, option1, option2, option3, option4) {
    if (option1 && !option2 && !option3 && !option4) {
      redis.hmset(
        "Poll:currentPoll",
        "title",
        title,
        "option1",
        option1,
        "option1_count",
        0
      );
    } else if (option1 && option2 && !option3 && !option4) {
      redis.hmset(
        "Poll:currentPoll",
        "title",
        title,
        "option1",
        option1,
        "option2",
        option2,
        "option1_count",
        0,
        "option2_count",
        0
      );
    } else if (option1 && option2 && option3 && !option4) {
      redis.hmset(
        "Poll:currentPoll",
        "title",
        title,
        "option1",
        option1,
        "option2",
        option2,
        "option3",
        option3,
        "option1_count",
        0,
        "option2_count",
        0,
        "option3_count",
        0
      );
    } else if (option1 && option2 && option3 && option4) {
      redis.hmset(
        "Poll:currentPoll",
        "title",
        title,
        "option1",
        option1,
        "option2",
        option2,
        "option3",
        option3,
        "option4",
        option4,
        "option1_count",
        0,
        "option2_count",
        0,
        "option3_count",
        0,
        "option4_count",
        0
      );
    }
  }

  getPollOptions() {
    return redis
      .hmgetAsync(
        "Poll:currentPoll",
        "option1",
        "option2",
        "option3",
        "option4"
      )
      .then(function(res) {
        return res;
        console.log(res);
      });
  }

  getPollTitle() {
    return redis.hgetAsync("Poll:currentPoll", "title").then(function(res) {
      return res;
    });
  }

  setPollVoter(voter) {
    return redis.RPUSH("Poll:voter", voter);
  }

  getPollVoter() {
    return redis
      .multi()
      .LRANGE("Poll:voter", 0, -1)
      .execAsync()
      .then(function(res) {
        console.log(res[0]);
        return res[0];
      });
  }

  lengthPollVoter() {
    return redis.llenAsync("Poll:voter").then(function(res) {
      return res;
    });
  }

  delPollVoter() {
    return redis.del("Poll:voter");
  }

  incrPollVote(option) {
    redis.hincrby("Poll:currentPoll", `option${option}_count`, 1);
  }

  getPollCount() {
    return redis
      .hmgetAsync(
        "Poll:currentPoll",
        "option1_count",
        "option2_count",
        "option3_count",
        "option4_count"
      )
      .then(function(res) {
        return res;
        console.log(res);
      });
  }

  delPollData() {
    return redis.del("Poll:currentPoll");
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

  setClickedUser(cat_id, clickedUser, clickedDateTime) {
    redis
      .multi()
      .LPUSH(`clickedUser`, user)
      .LPUSH(`clickedDateTime`, clickedDateTime)
      .LPUSH(`clickedCat`, cat_id)
      .execAsync()
      .then(function(err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
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

exports.session = new Session();
