var one = "/1/";
var two = "/2/";
var three = "/3/";
var four = "/4/";
var end = "/end/";

var option1 = msg.text.match(new RegExp(one + "(.[\\s\\S]*)" + two));
var option2 = msg.text.match(new RegExp(two + "(.[\\s\\S]*)" + three));
var option3 = msg.text.match(new RegExp(three + "(.[\\s\\S]*)" + four));
var option4 = msg.text.match(new RegExp(four + "(.[\\s\\S]*)" + end));

exports.keyboardWith1 = [
  [
    {
      text: option1[1],
      callback_data: option1[1]
    }
  ]
];
exports.keyboardWith2 = [
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
];
exports.keyboardWith3 = [
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
];

exports.keyboardWith4 = [
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
];
