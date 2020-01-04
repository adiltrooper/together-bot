const { bot } = require("./config/config_bot");
const { session } = require("./session");

exports.draftPollReply = function draftPollReply(msg, pollMessage) {
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

  if (option1 && !option2 && !option3 && !option4) {
    session.setPollData(title[1], option1[1]);
    return (draftPoll = `
        <b>This is your Draft Message:</b>

${pollMessage}

Your Options:
1: ${option1[1]}

⬇️<b>Select what you want to do with it</b>
`);
  } else if (option1 && option2 && !option3 && !option4) {
    session.setPollData(title[1], option1[1], option2[1]);
    return (draftPoll = `
        <b>This is your Draft Message:</b>

${pollMessage}

Your Options:
1: ${option1[1]}
2: ${option2[1]}

⬇️<b>Select what you want to do with it</b>
`);
  } else if (option1 && option2 && option3 && !option4) {
    session.setPollData(title[1], option1[1], option2[1], option3[1]);
    return (draftPoll = `
        <b>This is your Draft Message:</b>

${pollMessage}

Your Options:
1: ${option1[1]}
2: ${option2[1]}
3: ${option3[1]}

⬇️<b>Select what you want to do with it</b>
`);
  } else if (option1 && option2 && option3 && option4) {
    session.setPollData(
      title[1],
      option1[1],
      option2[1],
      option3[1],
      option4[1]
    );
    return (draftPoll = `
        <b>This is your Draft Message:</b>

${pollMessage}

Your Options:
1: ${option1[1]}
2: ${option2[1]}
3: ${option3[1]}
4: ${option4[1]}

⬇️<b>Select what you want to do with it</b>
`);
  }
};
