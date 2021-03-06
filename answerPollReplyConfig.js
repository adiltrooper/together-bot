const { bot } = require("./config/config_bot");
const { answerPollReplyMarkup } = require("./Markup");
const { session } = require("./session");

exports.answerPollReplyConfig = async function answerPollReplyConfig(
  callbackQuery,
  pollOption1,
  pollOption2,
  pollOption3,
  pollOption4
) {
  const pollCount = await session.getPollCount().catch(err => {
    console.log(err.message);
  });

  const pollMessage = await session.getPollMessage().catch(err => {
    console.log(err.message);
  });

  pollCount1 = parseInt(pollCount[0]);
  pollCount2 = parseInt(pollCount[1]);
  pollCount3 = parseInt(pollCount[2]);
  pollCount4 = parseInt(pollCount[3]);

  if (pollOption1 && !pollOption2 && !pollOption3 && !pollOption4) {
    bot.sendMessage(
      callbackQuery.from.id,
      `Thanks for voting! 🥳🥳🥳
      `,
      answerPollReplyMarkup()
    );
  } else if (pollOption1 && pollOption2 && !pollOption3 && !pollOption4) {
    totalCount = pollCount1 + pollCount2;
    option1Result = ((pollCount1 / totalCount) * 100).toFixed(1);
    option2Result = ((pollCount2 / totalCount) * 100).toFixed(1);
    bot.sendMessage(
      callbackQuery.from.id,
      `${pollMessage}

1️⃣${pollOption1}: <b>${option1Result}%</b>
2️⃣${pollOption2}: <b>${option2Result}%</b>

Thanks for voting! 🥳🥳🥳
      `,
      answerPollReplyMarkup()
    );
  } else if (pollOption1 && pollOption2 && pollOption3 && !pollOption4) {
    totalCount = pollCount1 + pollCount2 + pollCount3;
    option1Result = ((pollCount1 / totalCount) * 100).toFixed(1);
    option2Result = ((pollCount2 / totalCount) * 100).toFixed(1);
    option3Result = ((pollCount3 / totalCount) * 100).toFixed(1);

    bot.sendMessage(
      callbackQuery.from.id,
      `${pollMessage}

1️⃣${pollOption1}: <b>${option1Result}%</b>
2️⃣${pollOption2}: <b>${option2Result}%</b>
3️⃣${pollOption3}: <b>${option3Result}%</b>

Thanks for voting! 🥳🥳🥳
      `,
      answerPollReplyMarkup()
    );
  } else if (pollOption1 && pollOption2 && pollOption3 && pollOption4) {
    totalCount = pollCount1 + pollCount2 + pollCount3 + pollCount4;
    option1Result = ((pollCount1 / totalCount) * 100).toFixed(1);
    option2Result = ((pollCount2 / totalCount) * 100).toFixed(1);
    option3Result = ((pollCount3 / totalCount) * 100).toFixed(1);
    option4Result = ((pollCount4 / totalCount) * 100).toFixed(1);

    bot.sendMessage(
      callbackQuery.from.id,
      `${pollMessage}

  1️⃣${pollOption1}: <b>${option1Result}%</b>
  2️⃣${pollOption2}: <b>${option2Result}%</b>
  3️⃣${pollOption3}: <b>${option3Result}%</b>
  4️⃣${pollOption4}: <b>${option4Result}%</b>

  Thanks for participating! 🥳🥳🥳
      `,
      answerPollReplyMarkup()
    );
  }
};
