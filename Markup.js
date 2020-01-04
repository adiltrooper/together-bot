exports.existPollReplyMarkup = function existPollReplyMarkup() {
  return {
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
  };
};

exports.draftPollReplyMarkup = function draftPollReplyMarkup() {
  return {
    reply_markup: {
      keyboard: [["Back", "Send Post"]],
      resize_keyboard: true
    },
    parse_mode: "HTML"
  };
};

exports.answerPollReplyMarkup = function answerPollReplyMarkup() {
  return {
    parse_mode: "HTML"
  };
};
