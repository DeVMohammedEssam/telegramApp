const GeneratedNumber = require("../models/Numbers");

let transformNumber = (number) => {
  //011x -> 3
  let firstXIndex = number.indexOf("x");
  //011x-> 011
  let numbersBeforeX = number.slice(0, firstXIndex);
  //011x-> x1
  let firstNumber = numbersBeforeX.slice(
    numbersBeforeX.length - 1,
    numbersBeforeX.length
  );
  //011x-> x
  let xChars = number.slice(firstXIndex, number.length);
  //011x-> 10
  let begin =
    firstNumber +
    xChars
      .split("")
      .map((char) => 0)
      .join("");

  return begin;
};
let getStaticDynamicNumberRange = (from, to) => {
  //011x -> 3
  let firstXIndex = from.indexOf("x");
  //011x-> 011
  let numbersBeforeX = from.slice(0, firstXIndex - 1);
  let _from = transformNumber(from);
  let _to = transformNumber(to);
  return {
    staticPart: numbersBeforeX,
    from: _from,
    to: _to,
    count: _to - _from,
  };
};

const generateNumbers = async (req, res, err) => {
  const { from, to } = req.body;
  const data = getStaticDynamicNumberRange(from, to);
  const isDuplicate = await GeneratedNumber.findOne({
    numberFrom: from,
    numberTo: to,
  });
  if (isDuplicate) {
    return res
      .status(400)
      .json({ message: "this sequence has already been generated." });
  }
  const newNumber = await new GeneratedNumber({
    numberFrom: from,
    numberTo: to,
    ...data,
  }).save();
  res.json({ number: newNumber });
  //TODO:
  // { SAVE TO DB
  //     "staticPart": "201011",
  //     "from": "800000",
  //     "to": "900000",
  //     "count": 100000,
  //     "noFrom":from
  //      "noTo":to
  // }
  //from : 2010118xxxxx
  //to :   2010119xxxxx
};

const getGeneratedNumbers = async (req, res) => {
  try {
    const numbers = await GeneratedNumber.find({});
    res.json({ numbers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const FilterSequence = async (req, res) => {
  try {
    const { sequenceId } = req.body;
    if (!sequenceId) res.sendStatus(400);

    res.json({
      sequenceId,
    });
  } catch (error) {}
};
module.exports = {
  generateNumbers,
  getGeneratedNumbers,
  FilterSequence,
};
