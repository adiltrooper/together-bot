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

// const connection = mysql.createConnection(db);
// connection.connect(function(error) {
//   if (error) {
//     console.log("Error: " + error.message);
//   } else {
//     console.log("Connected");
//   }
// });

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

  bot.sendMessage(chat_id, "Welcome", {
    reply_markup: {
      keyboard: [
        ["Feelin' Adventurous", "I'm feelin chill"],
        ["I wanna stay home"]
      ],
      resize_keyboard: true
    }
  });
  bot.sendMessage(
    chat_id,
    `Hi ${msg.from.first_name}! Welcome to the Together Community!`
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

// bot.on("message", msg => {
//   switch (msg.text) {
//     case "I'm feelin' adventurous":
//       return connection.query(
//         "SELECT * FROM testdb ORDER BY RAND() LIMIT 1",
//         function(err, results, fields) {
//           if (err) {
//             console.log(err.message);
//           } else {
//             bot.sendMessage(119860989, results[0].activity);
//           }
//         }
//       );
//     case "I'm feelin chill":
//       return "Hello";
//     case "I wanna stay home":
//       return "Nop";
//   }
// });

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
  if (msg.text == "Feelin' Adventurous")
    pool.getConnection(function(err, connection) {
      if (err) console.log(err);
      switch (msg.text) {
        case "Feelin' Adventurous":
          return connection.query(
            "SELECT location, activity, short_desc, price, poi, website, bot_category.category_name AS category, imageURL FROM bot_listings_db LEFT JOIN bot_listing_category ON bot_listings_db.id = bot_listing_id LEFT JOIN bot_category ON bot_category_id = bot_category.id ORDER BY RAND() LIMIT 2",
            function(err, results, fields) {
              if (err) {
                console.log(err.message);
              } else {
                console.log(results);
                // prettier-ignore
                const newResults = results.map(result => {
                  return `
                  ${result.activity} @ ${result.location}
                  ${result.short_desc}
                  : from $${result.price}
                  `;
                });
                console.log(newResults);

                session.setRandomAdventurous(newResults);
                const location = results[0].location;
                const activity = results[0].activity;
                const short_desc = results[0].short_desc;
                const price = results[0].price;
                const poi = results[0].poi;
                const website = results[0].website;
                const category = results[0].category;
                const imageURL = results[0].imageURL;
                bot.sendPhoto(119860989, imageURL, {
                  caption: `${activity} @ ${location}
                  ${short_desc}

                  : from $${price}

                  :${poi}
                  :${website}
                  `,
                  disable_web_page_preview: true
                });
              }
            }
          );
        case "I'm feelin chill":
          return "Hello";
        case "I wanna stay home":
          return "Nop";
      }
      connection.release();
      if (err) console.log(err);
    });
});

// const constructedMsg = `${activity}@${location}
//  ${shortDesc}
//
//  : from $${price}
//  : ~${time} hours
//
//  : ${landmark}
//  : ${site}
//  `;
// bot.command(
//   "admin",
//   adminsOnly(msg => {
//     console.log("doing admin stuff");
//   })
// );
// if (msg.text === "I'm feelin' adventurous") {
//   connection.query("SELECT * FROM testdb ORDER BY RAND() LIMIT 1", function(
//     err,
//     results,
//     fields
//   ) {
//     if (err) {
//       console.log(err.message);
//     } else {
//       bot.sendMessage(119860989, results[0].activity);
//     }
//   });
// }
// });

// cloudinary.uploader.upload("sample.jpg", {"crop":"limit","tags":"samples","width":3000,"height":2000}, function(result) { console.log(result) });

// cloudinary.image("sample", {"crop":"fill","gravity":"faces","width":300,"height":200,"format":"jpg"});
