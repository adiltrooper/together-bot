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

bot.onText(/\/start/, msg => {
  console.log(msg);
  const chat_id = msg.chat.id;
  const first_name = msg.chat.first_name;
  const username = msg.chat.username;
  var user_type = "normal";

  if (keys.adminsId.includes(chat_id)) {
    var user_type = "admin";
  }

  bot.sendPhoto(
    chat_id,
    "https://res.cloudinary.com/dotogether/image/upload/v1575297277/Listings/Welcome%20Image.png"
  );
  bot.sendMessage(
    chat_id,
    `<b>Hi ${msg.from.first_name}! Welcome to the Together Community!</b>

So what can this bot do for you?
💡Get an outing idea with a single click below!
💡Stay tuned for specially curated ideas from the together team posted <b>3 times weekly</b>!
  `,
    {
      reply_markup: {
        keyboard: [
          ["Feelin' Adventurous", "I'm feelin chill"],
          ["I wanna stay home"]
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

const adminsOnly = async msg => {
  const member = await bot.getChatMember(msg.chat.id, msg.chat.id);
  var reply = await session.getAdminList();
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

bot.onText(/\/admin/, async msg => {
  const adminCheck = await adminsOnly(msg);
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
  const adminState = await session.getAdminState();
  console.log(adminState);
  if (msg.text == "New Post" && adminState == "admin1") {
    session.setAdminState2();
    bot.sendMessage(msg.chat.id, "Draft your message here:", {
      reply_markup: {
        keyboard: [["Back", "Exit Admin Session"]],
        resize_keyboard: true
      }
    });
  }
});

bot.on("message", async msg => {
  const adminState = await session.getAdminState();
  if (
    adminState == "admin2" &&
    (msg.text !== "Back") | (msg.text !== "Exit Admin Session")
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
  const adminState = await session.getAdminState();
  const draftImage = await session.getDraftImage();
  const draftCaption = await session.getDraftCaption();
  console.log(adminState);
  if (msg.text == "Send Post" && adminState == "admin3") {
    pool.getConnection(function(err, connection) {
      if (err) console.log(err);
      connection.query(
        'SELECT chat_id FROM bot_user_db WHERE user_type = "admin"',
        function(err, results, fields) {
          if (err) {
            console.log(err.message);
          } else {
            var userArray = [];
            userArray = results.map(userData => {
              return userData.chat_id;
            });
            session.setUserSendList(JSON.stringify(userArray));
          }
        }
      );
      connection.release();
      if (err) console.log(err);
    });
    const retrieveUserList = async () => {
      var userSendList = await session.getUserSendList();
      if (userSendList.includes(",")) {
        var userSendList = userSendList
          .slice(1, userSendList.length - 1)
          .split(",")
          .map(numberString => {
            return Number(numberString);
          });
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
});

bot.on("message", async msg => {
  const adminState = await session.getAdminState();
  console.log(msg);
  if (msg.text == "Exit Admin Session" && adminState == "admin1") {
    session.setAdminStateNull();
    bot.sendMessage(msg.chat.id, "Back to User Mode", {
      reply_markup: {
        keyboard: [
          ["Feelin' Adventurous", "I'm feelin chill"],
          ["I wanna stay home"]
        ],
        resize_keyboard: true
      }
    });
  } else if (msg.text == "Exit Admin Session" && adminState == "admin2") {
    session.setAdminStateNull();
    bot.sendMessage(msg.chat.id, "Back to User Mode", {
      reply_markup: {
        keyboard: [
          ["Feelin' Adventurous", "I'm feelin chill"],
          ["I wanna stay home"]
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
  }
});

//GENERATOR FUNCTIONALITY

bot.on("message", async msg => {
  if (
    msg.text == "Feelin' Adventurous" ||
    "I'm feelin chill" ||
    "I wanna stay home"
  ) {
    switch (msg.text) {
      case "Feelin' Adventurous":
        var cat_id = 1;
        var cachedListing = await session.getCachedAdventurous();
        break;
      case "I'm feelin chill":
        var cat_id = 2;
        var cachedListing = await session.getCachedChill();
        break;
      case "I wanna stay home":
        var cat_id = 3;
        var cachedListing = await session.getCachedHome();
        break;
      default:
        var cat_id = 1;
    }

    var activity = cachedListing[0][0];
    var location = cachedListing[1][0];
    var short_desc = cachedListing[2][0];
    var price = cachedListing[3][0];
    var poi = cachedListing[4][0];
    var website = cachedListing[5][0];
    var imageURL = cachedListing[6][0];

    if (price != "null") {
      var priceLine = `💸: from $${price}`;
    }

    if (poi != "null") {
      var poiLine = `📍: ${poi}`;
    }

    if (website != "null") {
      var websiteLine = `📮: ${website}`;
    }

    if (cachedListing[0][0]) {
      console.log("From Cache");
      bot.sendPhoto(119860989, imageURL, {
        caption:
          activity +
          " @ " +
          location +
          "\n\n" +
          short_desc +
          "\n\n" +
          priceLine +
          "\n\n" +
          poiLine +
          "\n" +
          websiteLine,

        //           `<b>☀️${activity} @ ${location}☀️</b>
        //
        // ${short_desc}
        //
        // ${price != "null" ? `💸: from $${price}` : ""}
        //
        // ${poi != "null" ? `📍: ${poi}` : ""}
        // ${website != "null" ? `📮: ${website}` : ""}
        //                 `,
        disable_web_page_preview: true,
        parse_mode: "HTML"
      });
    } else {
      console.log("attempting");

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
                var price = results[0].price;
                var poi = results[0].poi;
                var website = results[0].website;

                if (price != "null") {
                  var priceLine = `💸: from $${price}`;
                }

                if (poi != "null") {
                  var poiLine = `📍: ${poi}`;
                }

                if (website != "null") {
                  var websiteLine = `📮: ${website}`;
                }
                bot.sendPhoto(119860989, results[0].imageURL, {
                  caption:
                    results[0].activity +
                    " @ " +
                    results[0].location +
                    "\n\n" +
                    results[0].short_desc +
                    "\n\n" +
                    results[0].priceLine +
                    "\n\n" +
                    results[0].poiLine +
                    "\n" +
                    results[0].websiteLine,
                  //             caption: `<b>☀️${results[0].activity} @ ${
                  //               results[0].location
                  //             }☀️</b>
                  //
                  // ${results[0].short_desc}
                  //
                  // ${price != "null" ? `💸: from $${price}` : ""}
                  //
                  // ${poi != "null" ? `📍: ${poi}` : ""}
                  // ${website != "null" ? `📮: ${website}` : ""}
                  //         `,
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
