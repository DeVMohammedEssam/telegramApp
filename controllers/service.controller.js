const GeneratedNumber = require("../models/Numbers");
const Tokens = require("../models/Tokens");
const EventEmitter = require("events");

let { wait } = require("../utils/timers.js");
let cuid = require("cuid");
const { StringSession } = require("../services/gramjs").sessions;
let event = EventEmitter;
const apiId = 79865;
const apiHash = "d4e5e5a9635854cf8a807297da389d75";

const {
  TelegramClient,
  tl,
  utils,
  LocalStorageSession,
  Api,
} = require("../services/gramjs");
const User = require("../models/User");
const { Telegram } = require("../utils/Telegram");
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
    const numbers = await GeneratedNumber.findOne({ _id: sequenceId });
    //     "staticPart": "201011",
    //     "from": "800000",
    //     "to": "900000",
    //     "count": 100000,
    //     "noFrom":from
    //      "noTo":to
    // }
    const tokens = await Tokens.find({});

    filterTelegramNumbers(
      numbers._doc,
      tokens.map((token) => token.token),
      0,
      cuid()
    );

    const telegram = new Telegram();
    telegram.filterTelegramNumbers(
      numbers._doc,
      tokens.map((token) => token.token),
      0,
      cuid()
    );
    telegram.on("data", async ({ result }) => {
      try {
        const users = results.map(({ id, wasOnline, phone }) => ({
          telegramId: id,
          wasOnline,
          phone,
        }));
        const insertedUsers = await new User.insertMany(users);
        console.log("inserted users", insertedUsers);
        res.sendStatus(200);
      } catch (error) {
        res.json({ error: error.message });
      }
      //   //TODO:
      //   //DATA -> [{ id: 1458162226, wasOnline: 1611000837000, phone: '201100720374' }]
      //   // Save DB using insertMany
      //  // { id: 1458162226, wasOnline: 1611000837000, phone: '201100720374' }
    });

    if (!sequenceId) res.sendStatus(400);

    res.json({
      sequenceId,
      totalTelegramUsers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, timestamp } = req.body;
    console.log(text, timestamp);
  } catch (error) {}
};

const getFilterCount = async (req, res) => {
  try {
    const { timestamp } = req.query;
    const count = await User.getTimeFilterCount(timestamp);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAnalysis = async (req, res) => {
  try {
    const tokens = await Tokens.countDocuments();
    const usedNumbers = await GeneratedNumber.countDocuments({ isUsed: true });
    const unUsedNumbers = await GeneratedNumber.countDocuments({
      isUsed: false,
    });
    const users = await User.countDocuments();
    res.json({
      tokens,
      usedNumbers,
      unUsedNumbers,
      users,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ error });
  }
};
module.exports = {
  generateNumbers,
  getGeneratedNumbers,
  FilterSequence,
  sendMessage,
  getFilterCount,
  getAnalysis,
};
