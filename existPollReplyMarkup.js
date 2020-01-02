module.exports = function() {
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
