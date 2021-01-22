const GeneratedNumber = require("../models/Numbers");
const Tokens = require("../models/Tokens");
const EventEmitter = require("events");
let event = new EventEmitter();
let { wait } = require("../utils/timers.js");
let cuid = require("cuid");
const { StringSession } = require("../services/gramjs").sessions;

const apiId = 79865;
const apiHash = "d4e5e5a9635854cf8a807297da389d75";

const {
  TelegramClient,
  tl,
  utils,
  LocalStorageSession,
  Api,
} = require("../services/gramjs");
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

let filterBulkOfNumbers = async (numbers, token, hash, source = 0) => {
  let internalEvent = new EventEmitter();
  internalEvent.emit("filterBulkOfNumbersStart", new Date());
  let now = new Date();
  let intervalCheckSuccess;

  if (numbers.length == 0) {
    return [];
  }

  let random = cuid();
  const stringSession = new StringSession(token);
  let client;
  try {
    let result = 2;
    let retry = async () => {
      result = await Promise.race([
        new TelegramClient(stringSession, apiId, apiHash),
        wait(2),
      ]);
      //  console.log("RETRY" , result)
      if (result == 2) {
        await retry();
      }
    };
    await retry();
    console.log("AFTER RETRY");
    client = result;
  } catch (e) {
    console.log("ERROR ", e);
  }
  let retryConnect = async () => {
    let result = await Promise.race([client.connect(), wait(2)]);
    //  console.log("RETRY" , result)
    console.log("RETURY REREYCONNEXT");
    console.log(result);
    if (result == 2) {
      await retryConnect();
    }
  };
  await retryConnect();
  console.log("AFTER RETRY CONNECT");
  let _numbers = numbers.map(
    (number) =>
      new Api.InputPhoneContact({
        clientId: new Date().getTime(),
        phone: number,
        firstName: "Name" + random,
        lastName: "Last" + random,
      })
  );
  //console.log("NUMBERS ",_numbers)
  const ImportContacts = tl.requests.contacts.ImportContacts;
  //console.log(ImportContacts)

  const filterResult = await client.invoke(
    new ImportContacts({
      contacts: _numbers,
    })
  );
  let result = JSON.parse(JSON.stringify(filterResult)).users.map((user) => ({
    id: user.id,
    wasOnline: user.status && user.status.wasOnline * 1000,
    phone: user.phone,
  }));
  //console.log(result)
  internalEvent.emit("filterBulkOfNumbersEnd", new Date());
  client.disconnect();
  return result;
};

let filterTelegramNumbers = async (data, tokens, i = 0, hash) => {
  // let data={
  //     "staticPart": "201011",
  //     "from": "800000",
  //     "to": "900000",
  //     "count": 100000,
  // }

  data.staticPart = data.staticPart.replace("+", "");
  console.log("DATA ", data);
  if (Number(data.from) > Number(data.to)) {
    return;
  }
  let bulkCounter = 0;
  let numberCounter = Number(data.from);
  let builkOfNumbers = [];
  console.log(
    "Number(data.from)<=Number(data.to) ",
    Number(data.from),
    ":",
    Number(data.to)
  );
  while (Number(data.from) <= Number(data.to) && bulkCounter < 5) {
    bulkCounter++;
    numberCounter++;
    builkOfNumbers.push(`${data.staticPart}${numberCounter}`);
  }
  //console.log("TOKEN "+tokens[i%tokens.length])
  //console.log("builkOfNumbers ",builkOfNumbers)
  let _tokens = tokens[i % tokens.length];

  let result = await filterBulkOfNumbers(builkOfNumbers, _tokens, hash);

  console.log("RESULT ", result);
  if (builkOfNumbers.length == 0) return;
  event.emit("data", { result, hash });
  // console.log("ITER NUMBER: "+i)
  //console.log("builkOfNumbers.length: "+builkOfNumbers.length)
  //await wait(0)
  filterTelegramNumbers({ ...data, from: numberCounter }, tokens, ++i, hash);
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
    event.on("data", ({ result }) => {
      console.log("==================", result);
      //TODO:
      //DATA -> [{ id: 1458162226, wasOnline: 1611000837000, phone: '201100720374' }]
      // Save DB using insertMany
      // { id: 1458162226, wasOnline: 1611000837000, phone: '201100720374' }
    });
    if (!sequenceId) res.sendStatus(400);

    res.json({
      sequenceId,
    });
  } catch (error) {}
};

const sendMessage = async (req, res) => {
  try {
    const { text, timestamp } = req.body;
    console.log(text, timestamp);
  } catch (error) {}
};
module.exports = {
  generateNumbers,
  getGeneratedNumbers,
  FilterSequence,
  sendMessage,
};
