module.exports = function(option1, option2, option3, option4, caption) {
  if (option1 && !option2 && !option3 && !option4) {
    return {
      caption: { caption },
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: option1,
              callback_data: option1
            }
          ]
        ]
      }
    };
  } else if (option1 && option2 && !option3 && !option4) {
    return {
      caption: { caption },
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: option1,
              callback_data: option1
            }
          ],
          [
            {
              text: option2,
              callback_data: option2
            }
          ]
        ]
      }
    };
  } else if (option1 && option2 && option3 && !option4) {
    return {
      caption: { caption },
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: option1[1],
              callback_data: option1[1]
            }
          ],
          [
            {
              text: option2[1],
              callback_data: option2[1]
            }
          ],
          [
            {
              text: option3[1],
              callback_data: option3[1]
            }
          ]
        ]
      }
    };
  } else if (option1 && option2 && option3 && option4) {
    return {
      caption: { caption },
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: option1,
              callback_data: option1
            }
          ],
          [
            {
              text: option2,
              callback_data: option2
            }
          ],
          [
            {
              text: option3,
              callback_data: option3
            }
          ],
          [
            {
              text: option4,
              callback_data: option4
            }
          ]
        ]
      }
    };
  }
};
