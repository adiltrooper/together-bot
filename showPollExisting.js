const Session = require("./session");
const session = new Session();

module.exports = async function showPollExisting() {
  const pollOptions = await session.getPollOptions().catch(err => {
    console.log(err.message);
  });

  pollOption1 = pollOptions[0];
  pollOption2 = pollOptions[1];
  pollOption3 = pollOptions[2];
  pollOption4 = pollOptions[3];

  const pollCount = await session.getPollCount().catch(err => {
    console.log(err.message);
  });
  pollCount1 = parseInt(pollCount[0]);
  pollCount2 = parseInt(pollCount[1]);
  pollCount3 = parseInt(pollCount[2]);
  pollCount4 = parseInt(pollCount[3]);

  if (pollOption1 && pollOption2 && !pollOption3 && !pollOption4) {
    totalCount = pollCount1 + pollCount2;
    console.log(totalCount);
    option1Result = (pollCount1 / totalCount) * 100;
    option2Result = (pollCount2 / totalCount) * 100;

    bot.sendMessage(
      msg.chat.id,
      `<b>You have an Existing Poll!</b>

1️⃣${pollOption1}: <b>${option1Result}%</b>
2️⃣${pollOption2}: <b>${option2Result}%</b>

<b>Would you like to End it?</b>
      `,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Keep Poll",
                callback_data: "Keep Poll"
              }
            ],
            [
              {
                text: "🛑Stop Poll & Create New 🛑",
                callback_data: "🛑Stop Poll & Create New 🛑"
              }
            ]
          ]
        },
        parse_mode: "HTML"
      }
    );
  } else if (pollOption1 && pollOption2 && pollOption3 && !pollOption4) {
    totalCount = pollCount1 + pollCount2 + pollCount3;
    console.log(pollCount1);
    console.log(totalCount);
    option1Result = (pollCount1 / totalCount) * 100;
    option2Result = (pollCount2 / totalCount) * 100;
    option3Result = (pollCount3 / totalCount) * 100;

    bot.sendMessage(
      msg.chat.id,
      `<b>You have an Existing Poll!</b>

1️⃣${pollOption1}: <b>${option1Result}%</b>
2️⃣${pollOption2}: <b>${option2Result}%</b>
3️⃣${pollOption3}: <b>${option3Result}%</b>

<b>Would you like to End it?</b>
      `,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Keep Poll",
                callback_data: "Keep Poll"
              }
            ],
            [
              {
                text: "🛑Stop Poll & Create New 🛑",
                callback_data: "🛑Stop Poll & Create New 🛑"
              }
            ]
          ]
        },
        parse_mode: "HTML"
      }
    );
  } else if (pollOption1 && pollOption2 && pollOption3 && pollOption4) {
    totalCount = pollCount1 + pollCount2 + pollCount3 + pollCount4;
    console.log(totalCount);
    option1Result = (pollCount1 / totalCount) * 100;
    option2Result = (pollCount2 / totalCount) * 100;
    option3Result = (pollCount3 / totalCount) * 100;
    option4Result = (pollCount4 / totalCount) * 100;

    bot.sendMessage(
      msg.chat.id,
      `<b>You have an Existing Poll!</b>

1️⃣${pollOption1}: <b>${option1Result}%</b>
2️⃣${pollOption2}: <b>${option2Result}%</b>
3️⃣${pollOption3}: <b>${option3Result}%</b>
4️⃣${pollOption4}: <b>${option4Result}%</b>

<b>Would you like to End it?</b>
      `,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Keep Poll",
                callback_data: "Keep Poll"
              }
            ],
            [
              {
                text: "🛑Stop Poll & Create New 🛑",
                callback_data: "🛑Stop Poll & Create New 🛑"
              }
            ]
          ]
        },
        parse_mode: "HTML"
      }
    );
  }
};