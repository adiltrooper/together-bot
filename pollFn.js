module.exports = function(options, caption = null) {
  const res = {
    reply_markup: {
      inline_keyboard: options
        .filter(option => option)
        .map(option => [
          {
            text: option,
            callback_data: option
          }
        ])
    }
  };
  if (caption) {
      res.caption = caption;
  }
  return res;
};
