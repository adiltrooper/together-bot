const { pool } = require("./config/config_bot");

exports.dbStoreNewUser = function dbStoreNewUser(
  chat_id,
  first_name,
  username,
  user_type,
  status
) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      return;
    }
    connection.query(
      "INSERT INTO bot_user_db (chat_id, first_name, username, user_type, status) VALUES (?, ?, ?, ?, ?)",
      [chat_id, first_name, username, user_type, status],
      function(err, results, fields) {
        if (err) console.log(err.message);
      }
    );
    connection.release();
  });
};

exports.storeCompletePoll = function storeCompletePoll(
  pollTitle,
  callbackQuery,
  pollOption1,
  pollCount1,
  pollOption2,
  pollCount2,
  pollOption3,
  pollCount3,
  pollOption4,
  pollCount4
) {
  pool.getConnection(function(err, connection) {
    connection.query(
      "INSERT INTO bot_poll (title, created_by, option1, option1_count, option2, option2_count, option3, option3_count, option4, option4_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        pollTitle,
        callbackQuery.from.id,
        pollOption1,
        pollCount1,
        pollOption2,
        pollCount2,
        pollOption3,
        pollCount3,
        pollOption4,
        pollCount4
      ],
      function(err, results, fields) {
        if (err) {
          console.log(err.message);
        } else {
          console.log(`${pollTitle} poll has been inserted into database`);
        }
      }
    );
    connection.release();
    if (err) console.log(err);
  });
};

exports.getSubsCount = function getSubsCount() {
  return new Promise(async (resolve, reject) => {
    let connection;
    connection = await pool.getConnectionAsync();
    let subsCount = await connection.query(
      "SELECT COUNT(*) AS subsCount FROM bot_user_db",
      function(err, results, fields) {
        if (err) {
          console.log(err.message);
        } else {
          console.log(results[0].subsCount);
          var subsCount = results[0].subsCount;
          resolve(subsCount);
        }
      }
    );
  });
  connection.release();
};

exports.storeUserClickedCount = function storeUserClickedCount(
  clickedUser,
  clickedDateTime,
  cat_Id
) {

  formattedClickedUser = clickedUser.map(Number);
  formattedCat_Id = cat_Id.map(Number);


  pool.getConnection(function(err, connection) {
    if (err) console.log(err);
    connection.query(
      "INSERT INTO bot_click_tracking (clickedUser, clickedDateTime, category) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?)",
      [
        formattedClickedUser[0],
        clickedDateTime[0],
        formattedCat_Id[0],
        formattedClickedUser[1],
        clickedDateTime[1],
        formattedCat_Id[1],
        formattedClickedUser[2],
        clickedDateTime[2],
        formattedCat_Id[2],
        formattedClickedUser[3],
        clickedDateTime[3],
        formattedCat_Id[3],
        formattedClickedUser[4],
        clickedDateTime[4],
        formattedCat_Id[4],
        formattedClickedUser[5],
        clickedDateTime[5],
        formattedCat_Id[5],
        formattedClickedUser[6],
        clickedDateTime[6],
        formattedCat_Id[6],
        formattedClickedUser[7],
        clickedDateTime[7],
        formattedCat_Id[7],
        formattedClickedUser[8],
        clickedDateTime[8],
        formattedCat_Id[8],
        formattedClickedUser[9],
        clickedDateTime[9],
        formattedCat_Id[9]
      ],
      function(err, results, fields) {
        if (err) {
          console.log(err.message);
        } else {
          console.log("Click Data has been Stored");
        }
      }
    );
    connection.release();
    if (err) console.log(err);
  });
};

exports.dbStoreUserFeedbackText = function dbStoreUserFeedbackText(
  userGivingFeedback,
  textFeedback
) {
  pool.getConnection(function(err, connection) {
    if (err) console.log(err);
    connection.query(
      "INSERT INTO bot_user_feedback (user_id, text_feedback) VALUES (?,?)",
      [userGivingFeedback, textFeedback],
      function(err, results, fields) {
        if (err) console.log(err.message);
      }
    );
    connection.release();
    if (err) console.log(err);
  });
};

exports.dbStoreUserFeedbackPhoto = function dbStoreUserFeedbackPhoto(
  userGivingFeedback,
  photoFeedback,
  captionFeedback
) {
  pool.getConnection(function(err, connection) {
    if (err) console.log(err);
    connection.query(
      "INSERT INTO bot_user_feedback (user_id, photo_feedback, caption_feedback) VALUES (?, ?, ?, ?)",
      [userGivingFeedback, photoFeedback, captionFeedback],
      function(err, results, fields) {
        if (err) console.log(err.message);
      }
    );
    connection.release();
    if (err) console.log(err);
  });
};
