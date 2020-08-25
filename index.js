const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// app.use(express.static(__dirname + '/public'));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const logicArr = [];
let timeMoveArr = [];
let timeNmoveArr = [];

app.get("/result", (req, res) => {
  res.send(logicArr);
});

app.post("/timer", urlencodedParser, (req, res) => {
  console.log("Server has got a POST request");
  // res.send("The server has received your POST request")
  console.log(req.body);

  let intervals = 0;

  const sets = isNaN(parseFloat(req.body["sets-i"]))
    ? 0
    : parseFloat(req.body["sets-i"]);

  let warmupTime = isNaN(parseFloat(req.body["warmup-t"]))
    ? 0
    : parseFloat(req.body["warmup-t"]);
  const warmupRequired = req.body["warmup-r"];
  const warmupName = req.body["warmup-i"];

  let cooldownTime = isNaN(parseFloat(req.body["cooldown-t"]))
    ? 0
    : parseFloat(req.body["cooldown-t"]);
  const cooldownRequired = req.body["cooldown-r"];
  const cooldownName = req.body["cooldown-i"];

  let highintervalTime = isNaN(parseFloat(req.body["highint-t"]))
    ? 0
    : parseFloat(req.body["highint-t"]);
  const highintervalRequired = req.body["highint-r"];
  const highintervalName = req.body["highint-i"];

  let lowintervalTime = isNaN(parseFloat(req.body["lowint-t"]))
    ? 0
    : parseFloat(req.body["lowint-t"]);
  const lowintervalRequired = req.body["lowint-r"];
  const lowintervalName = req.body["lowint-i"];

  //convert time to 00:00 format;
  const warmupTimeFormat = new Date(warmupTime * 1000)
    .toISOString()
    .substr(14, 5);
  const cooldownTimeFormat = new Date(cooldownTime * 1000)
    .toISOString()
    .substr(14, 5);
  const highintervalTimeFormat = new Date(highintervalTime * 1000)
    .toISOString()
    .substr(14, 5);
  const lowintervalTimeFormat = new Date(lowintervalTime * 1000)
    .toISOString()
    .substr(14, 5);

  // if the item is not required, total time not count in that item
  warmupRequired === undefined
    ? (warmupTime = 0)
    : (warmupTime,
      logicArr.push({
        name: warmupName,
        timeFormat: warmupTimeFormat,
        time: warmupTime,
      }));

  for (let i = 0; i < sets; i++) {
    highintervalRequired === undefined
      ? (highintervalTime = 0)
      : (highintervalTime,
        logicArr.push({
          name: highintervalName,
          timeFormat: highintervalTimeFormat,
          time: highintervalTime,
        }));
    lowintervalRequired === undefined
      ? (lowintervalTime = 0)
      : (lowintervalTime,
        logicArr.push({
          name: lowintervalName,
          timeFormat: lowintervalTimeFormat,
          time: lowintervalTime,
        }));
  }

  cooldownRequired === undefined
    ? (cooldownTime = 0)
    : (cooldownTime,
      logicArr.push({
        name: cooldownName,
        timeFormat: cooldownTimeFormat,
        time: cooldownTime,
      }));

  //Calculate the total Time
  const totalTime =
    warmupTime + sets * (highintervalTime + lowintervalTime) + cooldownTime;
  const totalTimeFormat = new Date(totalTime * 1000)
    .toISOString()
    .substr(14, 5);
  console.log(totalTime);


  //Put logicArr[0] into timeMoveArr
  timeMoveArr.push(logicArr[0]);

  //Put logicArr[1] into timeNmoveArr
  timeNmoveArr.push(logicArr[1]);
  
  res.render("timer", {
    totalTime: totalTimeFormat,
    intervals: logicArr.length,
    totalItems: logicArr,
    timeMoveArr: timeMoveArr,
    timeNmoveArr: timeNmoveArr,
  });
  console.log("console.log in Server side");

  console.log(logicArr);
  // res.send(data);
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/api", (req, res) => {
  res.send("The server has received your GET request");
});

app.listen(4444, () => {
  console.log("Listening at port 4444");
});