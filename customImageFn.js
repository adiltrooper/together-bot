module.exports = function(option1, option2, option3, option4) {
  if (option1 && !option2 && !option3 && !option4) {
    return {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: option1,
              callback_data: option1
            }
          ]
        ],
        keyboard: [["Exit Admin Session"]]
      }
    };
  } else if (option1 && option2 && !option3 && !option4) {
    return {
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
        ],
        keyboard: [["Exit Admin Session"]]
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
        ],
        keyboard: [["Exit Admin Session"]]
      }
    };
  } else if (option1 && option2 && option3 && option4) {
    return {
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
        ],
        keyboard: [["Exit Admin Session"]]
      }
    };
  }
};
