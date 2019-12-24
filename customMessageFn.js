module.exports = function(option1, option2, option3, option4) {
  if (option1 && !option2 && !option3 && !option4) {
    return {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: option1[1],
              callback_data: option1[1]
            }
          ]
        ]
      }
    };
  } else if (option1 && option2 && !option3 && !option4) {
    return {
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
          ]
        ]
      }
    };
  } else if (option1 && option2 && option3 && !option4) {
    return {
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
          ],
          [
            {
              text: option4[1],
              callback_data: option4[1]
            }
          ]
        ]
      }
    };
  }
};
