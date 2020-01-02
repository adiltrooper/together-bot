module.exports = function(
  pollOption1,
  pollOption2,
  pollOption3,
  pollOption4,
  pollVoterLength,
  option1Result,
  option2Result,
  option3Result,
  option4Result
) {
  if (pollOption1 && !pollOption2 && !pollOption3 && !pollOption4) {
    return `<b>You have an Existing Poll!</b>

${pollVoterLength} people have participated!

<b>Would you like to End it?</b>
      `;
  } else if (pollOption1 && pollOption2 && !pollOption3 && !pollOption4) {
    return `<b>You have an Existing Poll!</b>

1️⃣${pollOption1}: <b>${option1Result}%</b>
2️⃣${pollOption2}: <b>${option2Result}%</b>

${pollVoterLength} people have participated!

<b>Would you like to End it?</b>
      `;
  } else if (pollOption1 && pollOption2 && pollOption3 && !pollOption4) {
    return `<b>You have an Existing Poll!</b>

1️⃣${pollOption1}: <b>${option1Result}%</b>
2️⃣${pollOption2}: <b>${option2Result}%</b>
3️⃣${pollOption3}: <b>${option3Result}%</b>

${pollVoterLength} people have participated!
<b>Would you like to End it?</b>
          `;
  } else if (pollOption1 && pollOption2 && pollOption3 && pollOption4) {
    return `<b>You have an Existing Poll!</b>

1️⃣${pollOption1}: <b>${option1Result}%</b>
2️⃣${pollOption2}: <b>${option2Result}%</b>
3️⃣${pollOption3}: <b>${option3Result}%</b>
4️⃣${pollOption4}: <b>${option4Result}%</b>

${pollVoterLength} people have participated!

<b>Would you like to End it?</b>
          `;
  }
};
