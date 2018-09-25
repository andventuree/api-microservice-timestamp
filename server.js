// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();
let bodyParser = require("body-parser");

// *************************************************************
// comment out these two lines when ready to be deployed
// necessary b/c port keeps changing when server is restarted
let developmentPort = 3000;
process.env.PORT = developmentPort;
// *************************************************************

// parses HTTP encodings
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// *************************************************************
// Timestamp API
// *************************************************************

// Helpers
const unixToUTC = unix_timestamp => new Date(unix_timestamp * 1);
//* 1 helps make timestamp readable by new Date
const isValid = date => date.toString() === "Invalid Date";
const endpointCreator = date => {
  return { unix: date.getTime(), utc: date.toUTCString() };
};

// User Story 3
// GET /api/timestamp/ => { unix: currentTimeInUnix, utc: currentTimeInUTC }
app.get("/api/timestamp", (req, res) => {
  let timestamp = endpointCreator(new Date());
  res.json(timestamp);
});

// User story 1
// GET /api/timestamp/2015-12-25 => { unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" }
// GET /api/timestamp/1450137600000 => { unix: 1450137600000, utc: "Tue, 15 Dec 2015 00:00:00 GMT" }
app.get("/api/timestamp/:date_string", (req, res) => {
  let { date_string } = req.params;

  let date =
    date_string.indexOf("-") === -1
      ? unixToUTC(date_string) //User story 2
      : new Date(date_string);

  let timestamp = isValid(date)
    ? { unix: null, utc: "Invalid Date" } //User story 5
    : endpointCreator(date); //User story 4

  res.json(timestamp);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
