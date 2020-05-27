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
  },
  { disable_web_page_preview: true }
  ;
};

exports.inUserStateMarkup = function inUserStateMarkup() {
  return {
    reply_markup: {
      keyboard: [
        ["☀️Feelin' Adventurous", "🧘🏼‍Feelin' Chill"],
        ["🏠I Wanna Stay Home"]
      ],
      resize_keyboard: true
    },
    parse_mode: "HTML"
  };
};

exports.inUserStayHomeStateMarkup = function inUserStayHomeStateMarkup() {
  return {
    reply_markup: {
      keyboard: [["🏠Give me a Stay Home Idea 🏠"]],
      resize_keyboard: true
    },
    parse_mode: "HTML"
  };
};

exports.adminStateMarkup = function adminStateMarkup() {
  return {
    reply_markup: {
      keyboard: [
        ["New Post", "Poll Post"],
        ["Subscriber Count"],
        ["Exit Admin Session"]
      ],
      resize_keyboard: true
    },
    parse_mode: "HTML"
  };
};

exports.feedbackStateMarkup = function feedbackStateMarkup() {
  return {
    reply_markup: {
      remove_keyboard: true
    },
    parse_mode: "HTML"
  };
};

exports.handleMsgMarkup = function handleMsgMarkup() {
  return {
    reply_markup: {
      keyboard: [
        ["☀️Feelin' Adventurous", "🧘🏼‍Feelin' Chill"],
        ["🏠I Wanna Stay Home"]
      ],
      resize_keyboard: true
    },
    parse_mode: "HTML"
  };
};

exports.handleMsgStayHomeMarkup = function handleMsgStayHomeMarkup() {
  return {
    reply_markup: {
      keyboard: [["🏠Give me a Stay Home Idea 🏠"]],
      resize_keyboard: true
    },
    parse_mode: "HTML"
  };
};

exports.helpMarkup = function helpMarkup() {
  return {
    reply_markup: {
      keyboard: [
        ["☀️Feelin' Adventurous", "🧘🏼‍Feelin' Chill"],
        ["🏠I Wanna Stay Home"]
      ],
      resize_keyboard: true
    },
    parse_mode: "HTML"
  };
};

exports.helpStayHomeMarkup = function helpStayHomeMarkup() {
  return {
    reply_markup: {
      keyboard: [["🏠Give me a Stay Home Idea 🏠"]],
      resize_keyboard: true
    },
    parse_mode: "HTML"
  };
};

exports.pushUpdateMsgMarkup = function pushUpdateMsgMarkup() {
  return {
    reply_markup: {
      keyboard: [["🏠Give me a Stay Home Idea 🏠"]],
      resize_keyboard: true
    },
    parse_mode: "HTML"
  };
};
