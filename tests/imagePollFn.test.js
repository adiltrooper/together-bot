const imagePollFn = require("../imagePollFn");

describe("imagePollFn function", () => {
    // might want to consider this edge case
//   it("should return correct value when all options are invalid", () => {
//     const result = imagePollFn("", "", "", "", 'test1');
//     const expected = {
//       caption: 'test1',
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "",
//               callback_data: ""
//             }
//           ]
//         ]
//       }
//     };
//     expect(result).toEqual(expected);
//   });

  it("should return correct value when option 1 is valid", () => {
    const result = imagePollFn("opt1", "", "", "", 'test2');
    const expected = {
      caption: 'test2',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "opt1",
              callback_data: "opt1"
            }
          ]
        ]
      }
    };
    expect(result).toEqual(expected);
  });

  it("should return correct value when option 1 and 2 are valid", () => {
    const result = imagePollFn("opt1", "opt2", "", "", 'test3');
    const expected = {
      caption: 'test3',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "opt1",
              callback_data: "opt1"
            }
          ],
          [
            {
              text: "opt2",
              callback_data: "opt2"
            }
          ]
        ]
      }
    };
    expect(result).toEqual(expected);
  });

  // not sure if there is a bug with the array accessor [1] in the imagePollFn file?
//   it("should return correct value when option 1, 2 and 3 are valid", () => {
//     const result = imagePollFn("opt1", "opt2", "opt3", "", 'test4');
//     const expected = {
//       caption: 'test4',
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "opt1",
//               callback_data: "opt1"
//             }
//           ],
//           [
//             {
//               text: "opt2",
//               callback_data: "opt2"
//             }
//           ],
//           [
//             {
//               text: "opt3",
//               callback_data: "opt3"
//             }
//           ]
//         ]
//       }
//     };
//     expect(result).toEqual(expected);
//   });

  it("should return correct value when all options are valid", () => {
    const result = imagePollFn("opt1", "opt2", "opt3", "opt4", 'test5');
    const expected = {
      caption: 'test5',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "opt1",
              callback_data: "opt1"
            }
          ],
          [
            {
              text: "opt2",
              callback_data: "opt2"
            }
          ],
          [
            {
              text: "opt3",
              callback_data: "opt3"
            }
          ],
          [
            {
              text: "opt4",
              callback_data: "opt4"
            }
          ]
        ]
      }
    };
    expect(result).toEqual(expected);
  });
});
