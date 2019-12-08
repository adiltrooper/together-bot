const keys = require("./config_keys/keys");
const express = require("express");
const _ = require("lodash/array");
var cloudinary = require("cloudinary");

const TelegramBot = require("node-telegram-bot-api"),
  host = process.env.HOST || "localhost", // probably this change is not required
  externalUrl = "https://together-bot.herokuapp.com",
  token = keys.botToken,
  bot = new TelegramBot(token, {
    webHook: { port: process.env.PORT, host: host }
  });
bot.setWebHook(externalUrl + `:443/bot` + token);

const Session = require("./session");

const axios = require("axios");
const mysql = require("mysql");
const db = require("./config_db/db");
const pool = mysql.createPool(db);
const bodyParser = require("body-parser");

cloudinary.config({
  cloud_name: db.cloudinary_cloudname,
  api_key: db.cloudinary_apikey,
  api_secret: db.cloudinary_secret
});

const app = express();
const session = new Session();

////////////// JOIN BOT //////////////////

bot.onText(/\/start/, msg => {
  const { first_name, username } = msg.chat;
  const chat_id = msg.chat.id;
  if (keys.adminsId.includes(chat_id)) {
    var user_type = "admin";
  } else var user_type = "normal";

  bot.sendPhoto(
    chat_id,
    "https://res.cloudinary.com/dotogether/image/upload/v1575297277/Listings/Welcome%20Image.png"
  );
  bot.sendMessage(
    chat_id,
    `<b>Hi ${first_name}! Welcome to the Together Community!</b>

So what can this bot do for you?
💡Get an outing idea with a single click below!
💡Stay tuned for specially curated ideas from the together team posted <b>3 times weekly</b>!
  `,
    {
      reply_markup: {
        keyboard: [
          ["☀️Feelin' Adventurous", "🧘🏼‍Feelin' Chill"],
          ["🏠I Wanna Stay Home"]
        ],
        resize_keyboard: true
      },
      parse_mode: "HTML"
    }
  );

  pool.getConnection(function(err, connection) {
    if (err) console.log(err);
    connection.query(
      "INSERT INTO bot_user_db (chat_id, first_name, username, user_type) VALUES (?, ?, ?, ?)",
      [chat_id, first_name, username, user_type],
      function(err, results, fields) {
        if (err) console.log(err.message);
      }
    );
    connection.release();
    if (err) console.log(err);
  });
});

/////////////// ADMIN CHECK FUNCTION ///////////////////

const adminsOnly = async msg => {
  const member = await bot
    .getChatMember(msg.chat.id, msg.chat.id)
    .catch(err => {
      console.log(err.message);
    });
  var reply = await session.getAdminList().catch(err => {
    console.log(err.message);
  });
  if (!reply) {
    session.setAdminList();
    var reply = keys.adminsId;
  }
  if (member && member.user.id == reply) {
    bot.sendMessage(
      msg.chat.id,
      `Hi ${member.user.first_name}! Welcome to the admin menu!`
    );
    session.setAdminState();
    return true;
  } else {
    bot.sendMessage(
      msg.chat.id,
      `Sorry ${member.user.first_name}, you are not an admin :(`
    );
  }
};

////////////////// ENTER ADMIN STATE /////////////////////

bot.onText(/\/admin/, async msg => {
  const adminCheck = await adminsOnly(msg).catch(err => {
    console.log(err.message);
  });
  if (adminCheck) {
    bot.sendMessage(msg.chat.id, "Select Option:", {
      reply_markup: {
        keyboard: [["New Post", "Custom Post"], ["Exit Admin Session"]],
        resize_keyboard: true
      }
    });
  } else {
    console.log("Sorry you are not an admin");
  }
});

bot.on("message", async msg => {
  if (msg.text == "New Post") {
    const adminState = await session.getAdminState().catch(err => {
      console.log(err.message);
    });
    console.log(adminState);
    if (adminState == "admin1") {
      session.setAdminState2();
      bot.sendMessage(msg.chat.id, "Draft your message here:", {
        reply_markup: {
          keyboard: [["Back", "Exit Admin Session"]],
          resize_keyboard: true
        }
      });
    }
  }
});

bot.on("message", async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  if (
    adminState == "admin2" &&
    (msg.text !== "Back" || msg.text !== "Exit Admin Session")
  ) {
    bot.sendMessage(msg.chat.id, "Select Option:", {
      reply_markup: {
        keyboard: [["Send Post", "Back"]],
        resize_keyboard: true
      }
    });
    console.log(msg);

    session.setDraftImage(msg.photo[0].file_id);
    session.setDraftCaption(msg.caption);
    session.setAdminState3();
  }
});

bot.on("message", async msg => {
  if (msg.text == "Send Post") {
    const adminState = await session.getAdminState().catch(err => {
      console.log(err.message);
    });
    const draftImage = await session.getDraftImage().catch(err => {
      console.log(err.message);
    });
    const draftCaption = await session.getDraftCaption().catch(err => {
      console.log(err.message);
    });
    console.log(adminState);
    if (adminState == "admin3") {
      pool.getConnection(function(err, connection) {
        if (err) console.log(err);
        connection.query("SELECT chat_id FROM bot_user_db", function(
          err,
          results,
          fields
        ) {
          if (err) {
            console.log(err.message);
          } else {
            var userArray = [];
            userArray = results.map(userData => {
              return userData.chat_id;
            });
            session.setUserSendList(JSON.stringify(userArray));
          }
        });
        connection.release();
        if (err) console.log(err);
      });
      const retrieveUserList = async () => {
        var userSendList = await session.getUserSendList().catch(err => {
          console.log(err.message);
          console.log("HERE IS A userSendList");
        });
        console.log(`This is the after ${userSendList}`);
        if (userSendList.includes(",")) {
          var userSendList = userSendList
            .slice(1, userSendList.length - 1)
            .split(",")
            .map(numberString => {
              return Number(numberString);
            });
          console.log(userSendList);
        } else {
          var userSendList = userSendList.slice(1, userSendList.length - 1);
          var userSendList = Number(userSendList);
          var userSendListTemp = [];
          userSendListTemp.push(userSendList);
          userSendList = userSendListTemp;
        }

        console.log(userSendList);

        var userSendList = _.chunk(userSendList, 2);
        console.log(userSendList);
        userSendList.map(subUserSendList => {
          const postMessages = () => {
            subUserSendList.map(userId => {
              //bot.sendMessage(userId, draftPost);
              console.log(userId);
              bot.sendPhoto(userId, draftImage, { caption: draftCaption });
            });
          };
          setTimeout(postMessages, 3000);
        });
      };
      retrieveUserList();
    }
  }
});

bot.on("message", async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  console.log(msg);
  if (msg.text == "Exit Admin Session" && adminState == "admin1") {
    session.setAdminStateNull();
    bot.sendMessage(msg.chat.id, "Back to User Mode", {
      reply_markup: {
        keyboard: [
          ["☀️Feelin' Adventurous", "🧘🏼‍Feelin' Chill"],
          ["🏠I Wanna Stay Home"]
        ],
        resize_keyboard: true
      }
    });
  } else if (msg.text == "Exit Admin Session" && adminState == "admin2") {
    session.setAdminStateNull();
    bot.sendMessage(msg.chat.id, "Back to User Mode", {
      reply_markup: {
        keyboard: [
          ["☀️Feelin' Adventurous", "🧘🏼‍Feelin' Chill"],
          ["🏠I Wanna Stay Home"]
        ],
        resize_keyboard: true
      }
    });
  } else if (msg.text == "Back" && adminState == "admin2") {
    session.setAdminState();
    bot.sendMessage(msg.chat.id, "Select Option:", {
      reply_markup: {
        keyboard: [["New Post", "Custom Post"], ["Exit Admin Session"]],
        resize_keyboard: true
      }
    });
  } else if (msg.text == "Back" && adminState == "admin3") {
    session.setAdminState2();
    session.delDraftImage();
    session.delDraftCaption();
    bot.sendMessage(msg.chat.id, "Draft your message here:", {
      reply_markup: {
        keyboard: [["Back", "Exit Admin Session"]],
        resize_keyboard: true
      }
    });
  }
});

//GENERATOR FUNCTIONALITY

bot.on("message", async msg => {
  if (
    msg.text == "☀️Feelin' Adventurous" ||
    msg.text == "🧘🏼‍Feelin' Chill" ||
    msg.text == "🏠I Wanna Stay Home"
  ) {
    switch (msg.text) {
      case "☀️Feelin' Adventurous":
        var cat_id = 1;
        var cachedListing = await session.getCachedAdventurous().catch(err => {
          console.log(err.message);
        });
        break;
      case "🧘🏼‍Feelin' Chill":
        var cat_id = 2;
        var cachedListing = await session.getCachedChill().catch(err => {
          console.log(err.message);
        });
        break;
      case "🏠I Wanna Stay Home":
        var cat_id = 3;
        var cachedListing = await session.getCachedHome().catch(err => {
          console.log(err.message);
        });
        break;
      default:
        var cat_id = 1;
        var cachedListing = await session.getCachedAdventurous().catch(err => {
          console.log(err.message);
        });
    }

    var activity = cachedListing[0][0];
    var location = cachedListing[1][0];
    var short_desc = cachedListing[2][0];
    var price = cachedListing[3][0];
    var poi = cachedListing[4][0];
    var website = cachedListing[5][0];
    var imageURL = cachedListing[6][0];

    function determineFormat(price, poi, website) {
      if (
        price !== "null" &&
        price !== "0" &&
        poi !== "null" &&
        website !== "null"
      ) {
        return (caption = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

💸: from $${price}

📍: ${poi}
📮: ${website}`);
      } else if (
        (price == "null" || price == "0") &&
        poi !== "null" &&
        website !== "null"
      ) {
        return (caption = `<b>☀️${activity} @ ${location}☀️</>

${short_desc}

📍: ${poi}
📮: ${website}`);
      } else if (
        (price == "null" || price == "0") &&
        poi == "null" &&
        website !== "null"
      ) {
        return (caption = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

📮: ${website}`);
      } else if (
        price !== "null" &&
        price !== "0" &&
        poi == "null" &&
        website !== "null"
      ) {
        return (caption = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

💸: from $${price}

📮: ${website}`);
      } else if (
        (price == "null" || price == "0") &&
        poi == "null" &&
        website == "null"
      ) {
        return (caption = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}`);
      }
    }

    determineFormat(price, poi, website);

    if (cachedListing[0][0]) {
      console.log("From Cache");
      bot.sendPhoto(msg.chat.id, imageURL, {
        caption: caption,
        disable_web_page_preview: true,
        parse_mode: "HTML"
      });
    } else {
      pool.getConnection(function(err, connection) {
        if (err) console.log(err);
        connection.beginTransaction(function(err) {
          if (err) console.log(err);
          connection.query(
            "SELECT location, activity, short_desc, price, poi, website, bot_category.category_name AS category, imageURL FROM bot_listings_db LEFT JOIN bot_listing_category ON bot_listings_db.id = bot_listing_id LEFT JOIN bot_category ON bot_category_id = bot_category.id WHERE bot_category_id = ? ORDER BY RAND() LIMIT 1",
            [cat_id],
            function(err, results, fields) {
              if (err) {
                return connection.rollback(function() {
                  console.log(err.message);
                  throw err;
                });
              } else {
                console.log(results);
                var activity = results[0].activity;
                var location = results[0].location;
                var short_desc = results[0].short_desc;
                var price = results[0].price;
                var poi = results[0].poi;
                var website = results[0].website;
                var imageURL = results[0].imageURL;

                function determineFormat2(price, poi, website) {
                  if (
                    price !== null &&
                    price !== 0 &&
                    poi !== null &&
                    website !== null
                  ) {
                    console.log("try0");
                    return (caption2 = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

💸: from $${price}

📍: ${poi}
📮: ${website}
                `);
                  } else if (
                    (price == null || price == 0) &&
                    poi !== null &&
                    website !== null
                  ) {
                    console.log("try1");
                    return (caption2 = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

📍: ${poi}
📮: ${website}
              `);
                  } else if (
                    (price == null || price == 0) &&
                    poi == null &&
                    website !== null
                  ) {
                    console.log("try2");
                    return (caption2 = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

📮: ${website}
              `);
                  } else if (
                    price !== null &&
                    price !== 0 &&
                    poi == null &&
                    website !== null
                  ) {
                    console.log("try3");
                    return (caption2 = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}

💸: from $${price}

📮: ${website}
`);
                  } else if (
                    (price == null || price == 0) &&
                    poi == null &&
                    website == null
                  ) {
                    console.log("try4");
                    return (caption2 = `<b>☀️${activity} @ ${location}☀️</b>

${short_desc}
            `);
                  } else {
                    console.log("FAILUREEEE");
                  }
                }
                determineFormat2(price, poi, website);

                bot.sendPhoto(msg.chat.id, results[0].imageURL, {
                  caption: caption2,

                  disable_web_page_preview: true,
                  parse_mode: "HTML"
                });
              }
              connection.query(
                "SELECT location, activity, short_desc, price, poi, website, bot_category.category_name AS category, imageURL FROM bot_listings_db LEFT JOIN bot_listing_category ON bot_listings_db.id = bot_listing_id LEFT JOIN bot_category ON bot_category_id = bot_category.id WHERE bot_category_id = ? ORDER BY RAND() LIMIT 10",
                [cat_id],
                function(err, results, fields) {
                  if (err) {
                    return connection.rollback(function() {
                      console.log(err.message);
                      throw err;
                    });
                  } else {
                    console.log(results);

                    const cachedActivity = results.map(result => {
                      return result.activity;
                    });
                    const cachedLocation = results.map(result => {
                      return result.location;
                    });
                    const cachedShort_desc = results.map(result => {
                      return result.short_desc;
                    });
                    const cachedPrice = results.map(result => {
                      return result.price;
                    });
                    const cachedPoi = results.map(result => {
                      return result.poi;
                    });
                    const cachedWebsite = results.map(result => {
                      return result.website;
                    });
                    const cachedImageURL = results.map(result => {
                      return result.imageURL;
                    });

                    session.setCachedListings(
                      cat_id,
                      cachedActivity,
                      cachedLocation,
                      cachedShort_desc,
                      cachedPrice,
                      cachedPoi,
                      cachedWebsite,
                      cachedImageURL
                    );
                  }
                  connection.commit(function(err) {
                    if (err) {
                      return connection.rollback(function() {
                        console.log(err);
                      });
                    }
                    console.log("cached");
                  });
                }
              );
            }
          );
        });
        connection.release();
      });
    }
  }
});
