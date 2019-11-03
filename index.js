const keys = require("./config_keys/keys");
const express = require("express");

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
// const db = require("./config_db/db");

const bodyParser = require("body-parser");

// const connection = mysql.createConnection(db);
//
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
  bot.sendMessage(
    msg.chat.id,
    `Hi ${msg.from.first_name}! Welcome to the Together Community!`
  );

  bot.sendMessage(119860989, "Welcome", {
    reply_markup: {
      keyboard: [
        ["I'm feelin' adventurous", "I'm feelin chill"],
        ["I wanna stay home"]
      ]
    }
  });
  console.log(msg);

  const chat_id = msg.chat.id;
  const first_name = msg.chat.first_name;
  const username = msg.chat.username;

  // connection.query(
  //   "INSERT INTO user_info (chat_id, first_name, username) VALUES (?, ?, ?)",
  //   [chat_id, first_name, username],
  //   function(err, results, fields) {
  //     if (err) {
  //       console.log(err.message);
  //     } else {
  //       return;
  //     }
  //   }
  // );
});

bot.sendMessage(119860989, "Welcome", {
  reply_markup: {
    keyboard: [
      ["I'm feelin' adventurous", "I'm feelin chill"],
      ["I wanna stay home"]
    ]
  }
});

bot.on("message", msg => {
  switch (msg.text) {
    case "I'm feelin' adventurous":
      return connection.query(
        "SELECT * FROM testdb ORDER BY RAND() LIMIT 1",
        function(err, results, fields) {
          if (err) {
            console.log(err.message);
          } else {
            bot.sendMessage(119860989, results[0].activity);
          }
        }
      );
    case "I'm feelin chill":
      return "Hello";
    case "I wanna stay home":
      return "Nop";
  }
});

const adminsOnly = async msg => {
  const member = await bot.getChatMember(msg.chat.id, msg.chat.id);
  if (member && member.user.id == keys.adminsId) {
    session.setAdminList();
    bot.sendMessage(
      msg.chat.id,
      `Hi ${member.user.first_name}! Welcome to the admin menu!`
    );
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
    }),
      setEnterAdminState();
  } else {
    console.log("Sorry you are not an admin");
  }
});

bot.on("message", msg => {
  switch (msg.text) {
    case "New Post":
      return (
        bot.sendMessage(msg.chat.id, "Select Option:", {
          reply_markup: {
            keyboard: [["Send Post", "Delete Postt"], ["Exit Admin Mode"]]
          }
        }),
        bot.sendMessage(msg.chat.id, "Craft your Message here!")
      );
    case "Custom Post":
      return "Hello";
    case "Exit Admin Mode":
      return "Nop";
  }
});

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
