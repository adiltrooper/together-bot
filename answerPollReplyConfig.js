module.exports = function(
  pollMessage,
  pollOption1,
  pollOption2,
  pollOption3,
  pollOption4,
  pollCount1,
  pollCount2,
  pollCount3,
  pollCount4
) {
  if (pollOption1 && !pollOption2 && !pollOption3 && !pollOption4) {
    return `Thanks for voting! 🥳🥳🥳`;
  } else if (pollOption1 && pollOption2 && !pollOption3 && !pollOption4) {
    totalCount = pollCount1 + pollCount2;
    option1Result = ((pollCount1 / totalCount) * 100).toFixed(1);
    option2Result = ((pollCount2 / totalCount) * 100).toFixed(1);
    return `${pollMessage}

1️⃣${pollOption1}: <b>${option1Result}%</b>
2️⃣${pollOption2}: <b>${option2Result}%</b>

Thanks for voting! 🥳🥳🥳
    `;
  } else if (pollOption1 && pollOption2 && pollOption3 && !pollOption4) {
    totalCount = pollCount1 + pollCount2 + pollCount3;
    option1Result = ((pollCount1 / totalCount) * 100).toFixed(1);
    option2Result = ((pollCount2 / totalCount) * 100).toFixed(1);
    option3Result = ((pollCount3 / totalCount) * 100).toFixed(1);

    return `${pollMessage}

1️⃣${pollOption1}: <b>${option1Result}%</b>
2️⃣${pollOption2}: <b>${option2Result}%</b>
3️⃣${pollOption3}: <b>${option3Result}%</b>

Thanks for voting! 🥳🥳🥳
    `;
  } else if (pollOption1 && pollOption2 && pollOption3 && pollOption4) {
    totalCount = pollCount1 + pollCount2 + pollCount3 + pollCount4;
    option1Result = ((pollCount1 / totalCount) * 100).toFixed(1);
    option2Result = ((pollCount2 / totalCount) * 100).toFixed(1);
    option3Result = ((pollCount3 / totalCount) * 100).toFixed(1);
    option4Result = ((pollCount4 / totalCount) * 100).toFixed(1);

    return `${pollMessage}

1️⃣${pollOption1}: <b>${option1Result}%</b>
2️⃣${pollOption2}: <b>${option2Result}%</b>
3️⃣${pollOption3}: <b>${option3Result}%</b>
4️⃣${pollOption4}: <b>${option4Result}%</b>

Thanks for participating! 🥳🥳🥳
    `;
  }
};
