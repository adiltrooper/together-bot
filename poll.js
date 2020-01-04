// const { bot } = require("./config/config_bot");
// const { session } = require("./session");
//
//
//
// bot.onText(/Poll Post/, async msg => {
//   const adminState = await session.getAdminState().catch(err => {
//     console.log(err.message);
//   });
//   const pollExists = await session.getPollTitle().catch(err => {
//     console.log(err.message);
//   });
//
//   if (adminState == "admin1" && pollExists) {
//     session.setAdminState("4");
//     async function showPollExisting() {
//       const pollOptions = await session.getPollOptions().catch(err => {
//         console.log(err.message);
//       });
//       const pollCount = await session.getPollCount().catch(err => {
//         console.log(err.message);
//       });
//       const pollVoterLength = await session.lengthPollVoter().catch(err => {
//         console.log(err.message);
//       });
//       existPollReply(msg.chat.id, pollOptions, pollCount, pollVoterLength);
//     }
//     showPollExisting();
//     bot.sendMessage(msg.chat.id, "Choose an Option or Exit", {
//       reply_markup: {
//         keyboard: [["Exit Admin Session"]],
//         resize_keyboard: true
//       }
//     });
//   } else if (adminState == "admin1" && !pollExists) {
//     session.delPollData();
//     session.delPollVoter();
//     session.setAdminState("5");
//     bot.sendMessage(msg.chat.id, "Draft your main message:", {
//       reply_markup: {
//         keyboard: [["Back", "Exit Admin Session"]],
//         resize_keyboard: true
//       }
//     });
//   }
// });
//
// bot.on("callback_query", async callbackQuery => {
//   const adminState = await session.getAdminState().catch(err => {
//     console.log(err.message);
//   });
//   if (
//     adminState == "admin4" &&
//     callbackQuery.data == "🛑Stop Poll & Create New 🛑"
//   ) {
//     bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
//     const pollOptions = await session.getPollOptions().catch(err => {
//       console.log(err.message);
//     });
//
//     pollOption1 = pollOptions[0];
//     pollOption2 = pollOptions[1];
//     pollOption3 = pollOptions[2];
//     pollOption4 = pollOptions[3];
//
//     const pollCount = await session.getPollCount().catch(err => {
//       console.log(err.message);
//     });
//     parseInt(pollCount[0])
//       ? (pollCount1 = parseInt(pollCount[0]))
//       : (pollCount1 = 0);
//     parseInt(pollCount[1])
//       ? (pollCount2 = parseInt(pollCount[1]))
//       : (pollCount2 = 0);
//     parseInt(pollCount[2])
//       ? (pollCount3 = parseInt(pollCount[2]))
//       : (pollCount3 = 0);
//     parseInt(pollCount[3])
//       ? (pollCount4 = parseInt(pollCount[3]))
//       : (pollCount4 = 0);
//
//     const pollTitle = await session.getPollTitle().catch(err => {
//       console.log(err.message);
//     });
//
//     pool.getConnection(function(err, connection) {
//       connection.query(
//         "INSERT INTO bot_poll (title, created_by, option1, option1_count, option2, option2_count, option3, option3_count, option4, option4_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//         [
//           pollTitle,
//           callbackQuery.from.id,
//           pollOption1,
//           pollCount1,
//           pollOption2,
//           pollCount2,
//           pollOption3,
//           pollCount3,
//           pollOption4,
//           pollCount4
//         ],
//         function(err, results, fields) {
//           if (err) {
//             console.log(err.message);
//           } else {
//             console.log(`${pollTitle} poll has been inserted into database`);
//           }
//         }
//       );
//       connection.release();
//       if (err) console.log(err);
//     });
//     session.delPollData();
//     session.delPollVoter();
//     session.setAdminState("5");
//     bot.sendMessage(
//       callbackQuery.from.id,
//       `
//       Current Poll has been Stopped and Saved
//
// <b>Create your New Poll Below 👇🏻
// Draft your main message:</b>
//       `,
//       {
//         reply_markup: {
//           keyboard: [["Back", "Exit Admin Session"]],
//           resize_keyboard: true
//         },
//         parse_mode: "HTML"
//       }
//     );
//   } else if (callbackQuery.data == "Keep Poll" && adminState == "admin4") {
//     bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
//     session.setAdminState("1");
//     bot.sendMessage(
//       callbackQuery.from.id,
//       `Welcome Back to the admin menu! Please select an Option:`,
//       {
//         reply_markup: {
//           keyboard: [
//             ["New Post", "Poll Post"],
//             ["Subscriber Count"],
//             ["Exit Admin Session"]
//           ],
//           resize_keyboard: true
//         }
//       }
//     );
//   }
// });
//
// bot.on("message", async msg => {
//   const adminState = await session.getAdminState().catch(err => {
//     console.log(err.message);
//   });
//   if (
//     adminState == "admin5" &&
//     msg.text !== "Back" &&
//     msg.text !== "Exit Admin Session" &&
//     msg.text !== "☀️Feelin' Adventurous" &&
//     msg.text !== "🧘🏼‍Feelin' Chill" &&
//     msg.text !== "🏠I Wanna Stay Home" &&
//     msg.text !== "/start" &&
//     msg.text !== "New Post" &&
//     msg.text !== "/admin"
//   ) {
//     await bot.sendMessage(
//       msg.chat.id,
//       `
// <b>Send Your Options in the Format:</b>
// /title/ My Poll Title
// /1/ Option 1 /2/ Option 2 /3/ Option 3 /4/ Option 4 /end/
// `,
//       {
//         parse_mode: "HTML"
//       }
//     );
//     console.log(msg);
//     if (msg.photo) {
//       session.setPollImage(msg.photo[0].file_id);
//       session.setPollMessage(msg.caption);
//     } else {
//       session.setPollMessage(msg.text);
//     }
//     session.setAdminState("6");
//   }
// });
//
// bot.on("message", async msg => {
//   const adminState = await session.getAdminState().catch(err => {
//     console.log(err.message);
//   });
//   if (
//     adminState == "admin6" &&
//     msg.text !== "Back" &&
//     msg.text !== "Exit Admin Session" &&
//     msg.text !== "☀️Feelin' Adventurous" &&
//     msg.text !== "🧘🏼‍Feelin' Chill" &&
//     msg.text !== "🏠I Wanna Stay Home" &&
//     msg.text !== "/start" &&
//     msg.text !== "New Post" &&
//     msg.text !== "/admin" &&
//     msg.text !== "/start" &&
//     msg.text !== "Send Post"
//   ) {
//     const pollImage = await session.getPollImage().catch(err => {
//       console.log(err.message);
//     });
//
//     const pollMessage = await session.getPollMessage().catch(err => {
//       console.log(err.message);
//     });
//
//     var draftPoll = draftPollReply(msg, pollMessage);
//
//     if (pollMessage && !pollImage) {
//       bot.sendMessage(msg.chat.id, draftPoll, {
//         reply_markup: {
//           keyboard: [["Back", "Send Post"]],
//           resize_keyboard: true
//         },
//         parse_mode: "HTML"
//       });
//     } else if (pollImage) {
//       bot.sendPhoto(msg.chat.id, pollImage, {
//         caption: draftPoll,
//         reply_markup: {
//           keyboard: [["Back", "Send Post"]],
//           resize_keyboard: true
//         },
//         parse_mode: "HTML"
//       });
//     }
//   }
// });
//
// bot.onText(/Send Post/, async msg => {
//   const adminState = await session.getAdminState().catch(err => {
//     console.log(err.message);
//   });
//   if (adminState == "admin6") {
//     const pollImage = await session.getPollImage().catch(err => {
//       console.log(err.message);
//     });
//     const pollMessage = await session.getPollMessage().catch(err => {
//       console.log(err.message);
//     });
//     const pollTitle = await session.getPollTitle().catch(err => {
//       console.log(err.message);
//     });
//     const pollOptions = await session.getPollOptions().catch(err => {
//       console.log(err.message);
//     });
//
//     var option1 = pollOptions[0];
//     var option2 = pollOptions[1];
//     var option3 = pollOptions[2];
//     var option4 = pollOptions[3];
//
//     async function getUsersFromDB() {
//       const connection = await pool.getConnectionAsync();
//       const query = new Promise((resolve, reject) => {
//         connection.query("SELECT chat_id FROM bot_user_db", function(
//           err,
//           results,
//           fields
//         ) {
//           if (err) {
//             console.log(err.message);
//           } else {
//             var userArray = [];
//             userArray = results.map(userData => {
//               return userData.chat_id;
//             });
//             session.setUserSendList(JSON.stringify(userArray));
//             resolve();
//           }
//         });
//       });
//       await query;
//       connection.release();
//     }
//
//     const retrieveUserList = async () => {
//       await getUsersFromDB();
//       var userSendList = await session.getUserSendList().catch(err => {
//         console.log(err.message);
//       });
//       console.log(`This is the after ${userSendList}`);
//       if (userSendList.includes(",")) {
//         var userSendList = userSendList
//           .slice(1, userSendList.length - 1)
//           .split(",")
//           .map(numberString => {
//             return Number(numberString);
//           });
//         console.log(userSendList);
//       } else {
//         var userSendList = userSendList.slice(1, userSendList.length - 1);
//         var userSendList = Number(userSendList);
//         var userSendListTemp = [];
//         userSendListTemp.push(userSendList);
//         userSendList = userSendListTemp;
//       }
//
//       var userSendList = _.chunk(userSendList, 2);
//       console.log(userSendList);
//       console.log(pollMessage);
//       userSendList.map(subUserSendList => {
//         const postMessages = () => {
//           subUserSendList.map(userId => {
//             if (!pollImage && pollMessage) {
//               bot
//                 .sendMessage(
//                   userId,
//                   pollMessage,
//                   messagePollFn(option1, option2, option3, option4)
//                 )
//                 .catch(err => {
//                   console.log(err);
//                   if (err.response.statusCode == 403) {
//                     const blocked_id = err.response.request.body.substring(
//                       err.response.request.body.indexOf("=") + 1,
//                       err.response.request.body.lastIndexOf("&")
//                     );
//
//                     pool.getConnection(function(err, connection) {
//                       if (err) console.log(err);
//                       connection.query(
//                         "UPDATE bot_user_db SET status = ? WHERE chat_id = ?",
//                         ["blocked", blocked_id],
//                         function(err, results, fields) {
//                           if (err) console.log(err.message);
//                         }
//                       );
//                       connection.release();
//                       if (err) console.log(err);
//                     });
//                   }
//                 });
//             } else {
//               bot
//                 .sendPhoto(
//                   userId,
//                   pollImage,
//                   imagePollFn(option1, option2, option3, option4, pollMessage)
//                 )
//                 .catch(err => {
//                   console.log(err);
//                   if (err.response.statusCode == 403) {
//                     const blocked_id = err.response.request.body.substring(
//                       err.response.request.body.indexOf("=") + 1,
//                       err.response.request.body.lastIndexOf("&")
//                     );
//
//                     pool.getConnection(function(err, connection) {
//                       if (err) console.log(err);
//                       connection.query(
//                         "UPDATE bot_user_db SET status = ? WHERE chat_id = ?",
//                         ["blocked", blocked_id],
//                         function(err, results, fields) {
//                           if (err) console.log(err.message);
//                         }
//                       );
//                       connection.release();
//                       if (err) console.log(err);
//                     });
//                   }
//                 });
//             }
//           });
//         };
//         setTimeout(postMessages, 3000);
//       });
//     };
//     retrieveUserList();
//     bot.sendMessage(msg.chat.id, "Message Sending!", {
//       reply_markup: {
//         keyboard: [["Exit Admin Session"]],
//         resize_keyboard: true
//       }
//     });
//   }
// });
//
// bot.on("callback_query", async callbackQuery => {
//   if (
//     callbackQuery.data !== "Keep Poll" &&
//     callbackQuery.data !== "🛑Stop Poll & Create New 🛑"
//   ) {
//     userPollSelection = callbackQuery.data;
//
//     const pollOptions = await session.getPollOptions().catch(err => {
//       console.log(err.message);
//     });
//
//     async function voteOrHasVoted(voter, vote) {
//       votedUsers = await session.getPollVoter().catch(err => {
//         if (err) {
//           console.log(err);
//         }
//       });
//       if (votedUsers.includes(voter.toString())) {
//         bot.sendMessage(voter, "You have already voted!");
//       } else {
//         session.setPollVoter(voter);
//         session.incrPollVote(vote);
//         answerPollReplyConfig(callbackQuery, pollOptions);
//       }
//     }
//
//     switch (userPollSelection) {
//       case pollOption1:
//         bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
//         voteOrHasVoted(callbackQuery.from.id, "1");
//         break;
//       case pollOption2:
//         bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
//         voteOrHasVoted(callbackQuery.from.id, "2");
//         break;
//       case pollOption3:
//         bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
//         voteOrHasVoted(callbackQuery.from.id, "3");
//         break;
//       case pollOption4:
//         bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
//         voteOrHasVoted(callbackQuery.from.id, "4");
//         break;
//       default:
//         bot.answerCallbackQuery(callbackQuery.id, { show_alert: true });
//         voteOrHasVoted(callbackQuery.from.id, "1");
//     }
//   }
// });
