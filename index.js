const keys = require("./config_keys/keys");
const express = require("express");
const _ = require("lodash/array");

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
        ["I'm feelin' adventurous", "I'm feelin chill"],
        ["I wanna stay home"]
      ]
    }
  });
  bot.sendMessage(
    chat_id,
    `Hi ${msg.from.first_name}! Welcome to the Together Community!`
  );

  pool.getConnection(function(err, connection) {
    if (err) console.log(err);
    connection.query(
      "INSERT INTO user_info (chat_id, first_name, username, user_type) VALUES (?, ?, ?, ?)",
      [chat_id, first_name, username, user_type],
      function(err, results, fields) {
        if (err) {
          console.log(err.message);
        } else {
          done(null, results);
        }
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
        keyboard: [["New Post", "Custom Post"], ["Exit Admin Mode"]]
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
    bot.sendMessage(msg.chat.id, "Select Option:", {
      reply_markup: {
        keyboard: [["Send Post", "Delete Post"], ["Exit Admin Mode"]]
      }
    }),
      bot.sendMessage(msg.chat.id, "Craft your Message here!");
  }
});

bot.on("message", async msg => {
  const adminState = await session.getAdminState();
  if (adminState == "admin2") {
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
        'SELECT chat_id FROM user_info WHERE user_type = "admin"',
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
            bot.sendPhoto(userId, draftPost, draftCaption);
          });
        };
        setTimeout(postMessages, 3000);
      });
    };
    retrieveUserList();
  }
});

//send draft
//save draft in variable
//take variable and send

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
