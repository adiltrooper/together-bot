const { pool } = require("./config/config_bot");

exports.dbStoreNewUser = function dbStoreNewUser(
  chat_id,
  first_name,
  username,
  user_type,
  status
) {
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
          return subsCount;
        }
      }
    );
    resolve(subsCount);
  });
  connection.release();
};

exports.storeUserClickedCount = function storeUserClickedCount(
  clickedUser,
  clickedDateTime,
  cat_Id
) {
  pool.getConnection(function(err, connection) {
    if (err) console.log(err);
    connection.query(
      "INSERT INTO bot_click_tracking (clickedUser, clickedDateTime, category) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?)",
      [
        clickedUser[0],
        clickedDateTime[0],
        cat_Id[0],
        clickedUser[1],
        clickedDateTime[1],
        cat_Id[1],
        clickedUser[2],
        clickedDateTime[2],
        cat_Id[2],
        clickedUser[3],
        clickedDateTime[3],
        cat_Id[3],
        clickedUser[4],
        clickedDateTime[4],
        cat_Id[4],
        clickedUser[5],
        clickedDateTime[5],
        cat_Id[5],
        clickedUser[6],
        clickedDateTime[6],
        cat_Id[6],
        clickedUser[7],
        clickedDateTime[7],
        cat_Id[7],
        clickedUser[8],
        clickedDateTime[8],
        cat_Id[8],
        clickedUser[9],
        clickedDateTime[9],
        cat_Id[9]
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
