const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const exphbs = require("express-handlebars");
const hbs = exphbs.create({ extname: ".hbs" });
const path = require("path");
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
let http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const apiId = 79865;

const apiHash = "d4e5e5a9635854cf8a807297da389d75";

const {
  TelegramClient,
  tl,
  utils,
  LocalStorageSession,
  Api,
} = require("./services/gramjs");
const { StringSession } = require("./services/gramjs").sessions;
const service = require("./routes/service.router");

function onError(e) {
  console.log("ON ERROR ", e);
}
app.use(express.static(path.join(__dirname, "public")));
const authFactory = async (phoneCallback, codeCallback) => {
  console.log("AUuth factory ");
  const stringSession = new StringSession();
  const client = new TelegramClient(stringSession, apiId, apiHash);
  await client.start({
    phoneNumber: phoneCallback,
    apiHash,
    apiId,
    phoneCode: codeCallback,
    onError,
    forceSMS: true,
  });
  return {
    token: stringSession.save(),
    client,
  };
};

io.on("connection", (socket) => {
  console.log("Connection");
  socket.on("sendVerificationMessageEvent", async (number) => {
    console.log(`sendVerificationMessageEvent ${number}`);
    const phoneCallback = () =>
      new Promise((resolve, reject) => {
        console.log("phoneCallback ", number);
        socket.emit("sendVerificationMessageEventStatus", true);
        resolve(number);
      });
    const codeCallback = () =>
      new Promise((resolve, reject) => {
        socket.emit("codeCallbackEvent");
        socket.on("codeCallbackEventResponse", (code) => {
          resolve(code);
        });
      });
    const { token, client } = await authFactory(phoneCallback, codeCallback);
    socket.emit("tokenResponse", { state: true, token });

    console.log(token);
  });
});
app.use("/api/service", service);

app.get("/", (req, res) => {
  res.render("home");
});

// app.post("/api/phone", (req, res) => {
//   const { phone_number } = req.body;

//   res.send(phone_number);
// });

// app.post("/api/verfication-code", (req, res) => {
//   const { verfication_code } = req.body;
//   res.send(phone_number);
// });

// app.post("/api/session", (req, res) => {
//   const { phone_number, code, hash_code } = req.body;
//   res.json({ data: req.body });
// });

http.listen(9000, () => console.log("running on port 9000"));
