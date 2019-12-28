const keys = require("./config_keys/keys");
const express = require("express");
const _ = require("lodash/array");
const customMessageFn = require("./customMessageFn");
const customImageFn = require("./customImageFn");
var cloudinary = require("cloudinary");

const TelegramBot = require("node-telegram-bot-api"),
  host = process.env.HOST || "localhost", // probably this change is not required
  externalUrl = process.env.externalURL,
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
  var status = "normal";
  if (keys.adminsId.includes(chat_id)) {
    var user_type = "admin";
  } else var user_type = "normal";

  bot.sendPhoto(
    chat_id,
    "https://res.cloudinary.com/dotogether/image/upload/v1576154842/Listings/Welcome%20Image.png"
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
      "INSERT INTO bot_user_db (chat_id, first_name, username, user_type, status) VALUES (?, ?, ?, ?, ?)",
      [chat_id, first_name, username, user_type, status],
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
  if (reply.includes(member.user.id)) {
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
    session.setAdminState();
    bot.sendMessage(
      msg.chat.id,
      `Hi <b>${msg.chat.first_name}</b>! Welcome to the admin menu!
Please Select an Option:`,
      {
        reply_markup: {
          keyboard: [
            ["New Post", "Custom Post"],
            ["Subscriber Count"],
            ["Exit Admin Session"]
          ],
          resize_keyboard: true
        },
        parse_mode: "HTML"
      }
    );
  } else {
    console.log("Sorry you are not an admin");
  }
});

bot.onText(/Subscriber Count/, async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  if (adminState == "admin1") {
    pool.getConnection(function(err, connection) {
      if (err) console.log(err);
      connection.query(
        "SELECT COUNT(*) AS subsCount FROM bot_user_db",
        function(err, results, fields) {
          if (err) console.log(err.message);
          console.log(results[0].subsCount);
          var subsCount = results[0].subsCount;

          bot.sendMessage(
            msg.chat.id,
            `TogetherSG now has <b>${subsCount}</b> subsribers!`,
            { parse_mode: "HTML" }
          );
        }
      );
      connection.release();
      if (err) console.log(err);
    });
  }
});

bot.onText(/Custom Post/, async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  session.setAdminState4();
  bot.sendMessage(msg.chat.id, "Draft your main message:", {
    reply_markup: {
      keyboard: [["Back", "Exit Admin Session"]],
      resize_keyboard: true
    }
  });
});

bot.on("message", async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  if (
    adminState == "admin4" &&
    msg.text !== "Back" &&
    msg.text !== "Exit Admin Session" &&
    msg.text !== "☀️Feelin' Adventurous" &&
    msg.text !== "🧘🏼‍Feelin' Chill" &&
    msg.text !== "🏠I Wanna Stay Home" &&
    msg.text !== "/start" &&
    msg.text !== "New Post" &&
    msg.text !== "/admin" &&
    msg.text !== "/start"
  ) {
    await bot.sendMessage(msg.chat.id, "Send your options in the form of");
    console.log(msg);
    if (msg.photo) {
      session.setDraftCustomImage(msg.photo[0].file_id);
      session.setDraftCustomCaption(msg.caption);
    } else {
      session.setPollMessage(msg.text);
    }
    session.setAdminState5();
    session.delPollData();
  }
});

bot.on("message", async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  if (
    adminState == "admin5" &&
    msg.text !== "Back" &&
    msg.text !== "Exit Admin Session" &&
    msg.text !== "☀️Feelin' Adventurous" &&
    msg.text !== "🧘🏼‍Feelin' Chill" &&
    msg.text !== "🏠I Wanna Stay Home" &&
    msg.text !== "/start" &&
    msg.text !== "New Post" &&
    msg.text !== "/admin" &&
    msg.text !== "/start"
  ) {
    var zero = "/title/";
    var one = "/1/";
    var two = "/2/";
    var three = "/3/";
    var four = "/4/";
    var end = "/end/";

    var title = msg.text.match(new RegExp(zero + "(.[\\s\\S]*)" + one));
    var option1 = msg.text.match(new RegExp(one + "(.[\\s\\S]*)" + two));
    var option2 = msg.text.match(new RegExp(two + "(.[\\s\\S]*)" + three));
    var option3 = msg.text.match(new RegExp(three + "(.[\\s\\S]*)" + four));
    var option4 = msg.text.match(new RegExp(four + "(.[\\s\\S]*)" + end));

    const draftCustomImage = await session.getDraftCustomImage().catch(err => {
      console.log(err.message);
    });
    const draftCustomCaption = await session
      .getDraftCustomCaption()
      .catch(err => {
        console.log(err.message);
      });
    const draftPollMessage = await session.getPollMessage().catch(err => {
      console.log(err.message);
    });

    const customFormatfn = () => {
      if (draftPollMessage) {
        if (option1 && !option2 && !option3 && !option4) {
          session.setPollData(title[1], option1[1]);
          return (draftCustom = `
            This is your draft message

${draftPollMessage}

Your Options:
1: ${option1[1]}
            `);
        } else if (option1 && option2 && !option3 && !option4) {
          session.setPollData(title[1], option1[1], option2[1]);
          return (draftCustom = `
            This is your draft message

${draftPollMessage}

Your Options:
1: ${option1[1]}
2: ${option2[1]}
            `);
        } else if (option1 && option2 && option3 && !option4) {
          session.setPollData(title[1], option1[1], option2[1], option3[1]);
          return (draftCustom = `
            This is your draft message

${draftPollMessage}

Your Options:
1: ${option1[1]}
2: ${option2[1]}
3: ${option3[1]}
            `);
        } else if (option1 && option2 && option3 && option4) {
          session.setPollData(
            title[1],
            option1[1],
            option2[1],
            option3[1],
            option4[1]
          );
          return (draftCustom = `
            This is your draft message

${draftPollMessage}

Your Options:
1: ${option1[1]}
2: ${option2[1]}
3: ${option3[1]}
4: ${option4[1]}
            `);
        }
      } else if (draftCustomImage) {
        if (option1 && !option2 && !option3 && !option4) {
          session.setPollData(title[1], option1[1]);
          return (draftCustom = `
Your Options:
1: ${option1[1]}
            `);
        } else if (option1 && option2 && !option3 && !option4) {
          session.setPollData(title[1], option1[1], option2[1]);
          return (draftCustom = `
Your Options:
1: ${option1[1]}
2: ${option2[1]}
            `);
        } else if (option1 && option2 && option3 && !option4) {
          session.setPollData(title[1], option1[1], option2[1], option3[1]);
          return (draftCustom = `
Your Options:
1: ${option1[1]}
2: ${option2[1]}
3: ${option3[1]}
            `);
        } else if (option1 && option2 && option3 && option4) {
          session.setPollData(
            title[1],
            option1[1],
            option2[1],
            option3[1],
            option4[1]
          );
          return (draftCustom = `
Your Options:
1: ${option1[1]}
2: ${option2[1]}
3: ${option3[1]}
4: ${option4[1]}
            `);
        }
      }
    };
    customFormatfn();

    if (draftPollMessage) {
      bot.sendMessage(msg.chat.id, draftCustom, {
        reply_markup: {
          keyboard: [["Back", "Send Post"]]
        },
        resize_keyboard: true
      });
    } else if (draftCustomImage) {
      bot.sendPhoto(msg.chat.id, draftCustomImage, {
        caption: draftCustomCaption
      });
      bot.sendMessage(msg.chat.id, draftCustom, {
        reply_markup: {
          keyboard: [["Back", "Send Post"]]
        },
        resize_keyboard: true
      });
    }
  }
});

bot.onText(/Send Post/, async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });

  console.log(adminState);
  if (adminState == "admin5") {
    const draftCustomImage = await session.getDraftCustomImage().catch(err => {
      console.log(err.message);
    });
    const draftCustomCaption = await session
      .getDraftCustomCaption()
      .catch(err => {
        console.log(err.message);
      });
    const pollMessage = await session.getPollMessage().catch(err => {
      console.log(err.message);
    });
    const pollTitle = await session.getPollTitle().catch(err => {
      console.log(err.message);
    });
    const pollOptions = await session.getPollData().catch(err => {
      console.log(err.message);
    });

    console.log(pollOptions);
    console.log(pollTitle);
    var option1 = pollOptions[0];
    var option2 = pollOptions[1];
    var option3 = pollOptions[2];
    var option4 = pollOptions[3];
    console.log(option1);
    pool.getConnection(function(err, connection) {
      connection.query(
        "INSERT INTO bot_poll (title, created_by, option1, option2, option3, option4) VALUES (?, ?, ?, ?, ?, ?)",
        [draftCustomTitle, msg.chat.id, option1, option2, option3, option4],
        function(err, results, fields) {
          if (err) {
            console.log(err.message);
          }
        }
      );
      connection.release();
      if (err) console.log(err);
    });

    const getUsersAndSend = async () => {
      await pool.getConnection(function(err, connection) {
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

        var userSendList = _.chunk(userSendList, 2);
        console.log(userSendList);
        userSendList.map(subUserSendList => {
          const postMessages = () => {
            subUserSendList.map(userId => {
              if (!draftCustomImage) {
                bot
                  .sendMessage(
                    userId,
                    draftPollMessage,
                    customMessageFn(option1, option2, option3, option4)
                  )
                  .catch(err => {
                    console.log(err);
                    if (err.statusCode == 403) {
                      const blocked_id = err.body.substring(
                        err.body.lastIndexOf("=") + 1,
                        err.body.lastIndexOf("&")
                      );

                      pool.getConnection(function(err, connection) {
                        if (err) console.log(err);
                        connection.query(
                          "INSERT INTO bot_user_db (status) WHERE chat_id = ?",
                          [blocked_id],
                          function(err, results, fields) {
                            if (err) console.log(err.message);
                          }
                        );
                        connection.release();
                        if (err) console.log(err);
                      });
                    }
                  });
              } else {
                bot
                  .sendPhoto(
                    userId,
                    draftCustomImage,
                    customImageFn(option1, option2, option3, option4)
                  )
                  .catch(err => {
                    console.log(err);
                    if (err.statusCode == 403) {
                      const blocked_id = err.body.substring(
                        err.body.lastIndexOf("=") + 1,
                        err.body.lastIndexOf("&")
                      );

                      pool.getConnection(function(err, connection) {
                        if (err) console.log(err);
                        connection.query(
                          "INSERT INTO bot_user_db (status) WHERE chat_id = ?",
                          [blocked_id],
                          function(err, results, fields) {
                            if (err) console.log(err.message);
                          }
                        );
                        connection.release();
                        if (err) console.log(err);
                      });
                    }
                  });
              }
            });
          };
          setTimeout(postMessages, 3000);
        });
      };
      retrieveUserList();
    };
    getUsersAndSend();
  }
});

bot.on("callback_query", async callbackQuery => {
  console.log(callbackQuery);
  console.log(callbackQuery.data);
  const runningPollOptions = await session.getCustomOptions().catch(err => {
    console.log(err.message);
  });
  console.log(runningPollOptions[0]);
  pollOption1 = runningPollOptions[0][0];
  pollOption2 = runningPollOptions[0][1];
  pollOption3 = runningPollOptions[0][2];
  pollOption4 = runningPollOptions[0][3];

  console.log(pollOption1);

  const pollOption1Replies = await session.getPollReplyOption1().catch(err => {
    console.log(err.message);
  });
  const pollOption2Replies = await session.getPollReplyOption2().catch(err => {
    console.log(err.message);
  });
  const pollOption3Replies = await session.getPollReplyOption3().catch(err => {
    console.log(err.message);
  });
  const pollOption4Replies = await session.getPollReplyOption4().catch(err => {
    console.log(err.message);
  });

  const pollTitle = await session.getDraftCustomTitle().catch(err => {
    console.log(err.message);
  });

  if (callbackQuery.data == pollOption1) {
    if (pollOption1Replies[0].length >= 5) {
      bot.sendMessage(callbackQuery.from.id, "Thank you for participating");
      bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
      session.delPollReplyOption1();
      pool.getConnection(function(err, connection) {
        if (err) console.log(err);
        connection.query(
          "UPDATE bot_poll SET option1_ans = option1_ans + 5 WHERE title = ?",
          pollTitle,
          function(err, results, fields) {
            if (err) console.log(err.message);
            console.log("inserted");
          }
        );
        connection.release();
        if (err) console.log(err);
      });
    } else if (pollOption1Replies[0].length <= 5) {
      session.setPollReplyOption1(callbackQuery.from.id);
      bot.sendMessage(callbackQuery.from.id, "Thank you for participating");
      bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
    }
  } else if (callbackQuery.data == pollOption2) {
    if (pollOption2Replies[0].length >= 5) {
      session.delPollReplyOption2();
      pool.getConnection(function(err, connection) {
        if (err) console.log(err);
        connection.query(
          "UPDATE bot_poll SET option2_ans = option2_ans + 5 WHERE title = ?",
          pollTitle,
          function(err, results, fields) {
            if (err) console.log(err.message);
            console.log("inserted");
          }
        );
        connection.release();
        if (err) console.log(err);
      });
    } else if (pollOption2Replies[0].length <= 5) {
      session.setPollReplyOption2(callbackQuery.from.id);
      bot.sendMessage(callbackQuery.from.id, "Thank you for participating");
    }
  } else if (callbackQuery.data == pollOption3) {
    if (pollOption3Replies[0].length >= 5) {
      session.delPollReplyOption3();
      pool.getConnection(function(err, connection) {
        if (err) console.log(err);
        connection.query(
          "UPDATE bot_poll SET option3_ans = option3_ans + 5 WHERE title = ?",
          pollTitle,
          function(err, results, fields) {
            if (err) console.log(err.message);
            console.log("inserted");
          }
        );
        connection.release();
        if (err) console.log(err);
      });
    } else if (pollOption3Replies[0].length <= 5) {
      session.setPollReplyOption3(callbackQuery.from.id);
      bot.sendMessage(callbackQuery.from.id, "Thank you for participating");
    }
  } else if (callbackQuery.data == pollOption4) {
    if (pollOption4Replies[0].length >= 5) {
      session.delPollReplyOption4();
      pool.getConnection(function(err, connection) {
        if (err) console.log(err);
        connection.query(
          "UPDATE bot_poll SET option4_ans = option4_ans + 5 WHERE title = ?",
          pollTitle,
          function(err, results, fields) {
            if (err) console.log(err.message);
            console.log("inserted");
          }
        );
        connection.release();
        if (err) console.log(err);
      });
    } else if (pollOption4Replies[0].length <= 5) {
      session.setPollReplyOption4(callbackQuery.from.id);
      bot.sendMessage(callbackQuery.from.id, "Thank you for participating");
    }
  }
});

bot.onText(/New Post/, async msg => {
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
  } else {
    session.setAdminStateNull();
    bot.sendMessage(
      msg.chat.id,
      "Something went wrong, Please inform Adil. You can try again if you want to.",
      {
        reply_markup: {
          keyboard: [
            ["☀️Feelin' Adventurous", "🧘🏼‍Feelin' Chill"],
            ["🏠I Wanna Stay Home"]
          ],
          resize_keyboard: true
        }
      }
    );
  }
});

bot.on("message", async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  if (
    adminState == "admin2" &&
    msg.text !== "Back" &&
    msg.text !== "Exit Admin Session" &&
    msg.text !== "☀️Feelin' Adventurous" &&
    msg.text !== "🧘🏼‍Feelin' Chill" &&
    msg.text !== "🏠I Wanna Stay Home" &&
    msg.text !== "/start" &&
    msg.text !== "New Post" &&
    msg.text !== "/admin" &&
    msg.text !== "/start"
  ) {
    await bot.sendMessage(
      msg.chat.id,
      "What do you want to do with your draft:",
      {
        reply_markup: {
          keyboard: [["Send Post", "Back"]],
          resize_keyboard: true
        }
      }
    );
    console.log(msg);
    if (msg.photo) {
      session.setDraftImage(msg.photo[0].file_id);
      session.setDraftCaption(msg.caption);
    } else {
      session.setDraftMessage(msg.text);
    }
    session.setAdminState3();
  }
});

bot.onText(/Send Post/, async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  const draftImage = await session.getDraftImage().catch(err => {
    console.log(err.message);
  });
  const draftCaption = await session.getDraftCaption().catch(err => {
    console.log(err.message);
  });
  const draftMessage = await session.getDraftMessage().catch(err => {
    console.log(err.message);
  });
  console.log(adminState);
  if (adminState == "admin3") {
    const getUsersAndSend = async () => {
      await pool.getConnection(function(err, connection) {
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

        var userSendList = _.chunk(userSendList, 2);
        console.log(userSendList);
        userSendList.map(subUserSendList => {
          const postMessages = () => {
            subUserSendList.map(userId => {
              if (!draftImage) {
                bot.sendMessage(userId, draftMessage).catch(err => {
                  console.log(err);
                  if (err.statusCode == 403) {
                    const blocked_id = err.body.substring(
                      err.body.lastIndexOf("=") + 1,
                      err.body.lastIndexOf("&")
                    );

                    pool.getConnection(function(err, connection) {
                      if (err) console.log(err);
                      connection.query(
                        "INSERT INTO bot_user_db (status) WHERE chat_id = ?",
                        [blocked_id],
                        function(err, results, fields) {
                          if (err) console.log(err.message);
                        }
                      );
                      connection.release();
                      if (err) console.log(err);
                    });
                  }
                });
              } else {
                console.log(userId);
                bot
                  .sendPhoto(userId, draftImage, { caption: draftCaption })
                  .catch(err => {
                    console.log(err);
                    if (err.statusCode == 403) {
                      const blocked_id = err.body.substring(
                        err.body.lastIndexOf("=") + 1,
                        err.body.lastIndexOf("&")
                      );

                      pool.getConnection(function(err, connection) {
                        if (err) console.log(err);
                        connection.query(
                          "INSERT INTO bot_user_db (status) WHERE chat_id = ?",
                          [blocked_id],
                          function(err, results, fields) {
                            if (err) console.log(err.message);
                          }
                        );
                        connection.release();
                        if (err) console.log(err);
                      });
                    }
                  });
              }
            });
          };
          setTimeout(postMessages, 3000);
        });
      };
      retrieveUserList();
    };
    getUsersAndSend();
  }
});

/////////////////// EXITING /////////////////////////

bot.onText(/Exit Admin Session/, async msg => {
  await session.setAdminStateNull();
  bot.sendMessage(msg.chat.id, "Back to User Mode", {
    reply_markup: {
      keyboard: [
        ["☀️Feelin' Adventurous", "🧘🏼‍Feelin' Chill"],
        ["🏠I Wanna Stay Home"]
      ],
      resize_keyboard: true
    }
  });
});

bot.onText(/Back/, async msg => {
  const adminState = await session.getAdminState().catch(err => {
    console.log(err.message);
  });
  switch (adminState) {
    case "admin2":
      session.setAdminState();
      bot.sendMessage(msg.chat.id, `Please Select an Option:`, {
        reply_markup: {
          keyboard: [
            ["New Post", "Custom Post"],
            ["Subscriber Count"],
            ["Exit Admin Session"]
          ],
          resize_keyboard: true
        }
      });
      break;
    case "admin3":
      session.setAdminState2();
      session.delDraftImage();
      session.delDraftCaption();
      bot.sendMessage(msg.chat.id, "Draft your message here:", {
        reply_markup: {
          keyboard: [["Back", "Exit Admin Session"]],
          resize_keyboard: true
        }
      });
      break;
    default:
      session.setAdminState();
      bot.sendMessage(msg.chat.id, `Please Select an Option:`, {
        reply_markup: {
          keyboard: [
            ["New Post", "Custom Post"],
            ["Subscriber Count"],
            ["Exit Admin Session"]
          ],
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
