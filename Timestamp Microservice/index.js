// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

api.get("/api", (req, res) => {
  let currentUnix = new Date().getTime();
  let currentUtc = new Date().toUTCString();
  res.json({ unix: currentUnix, utc: currentUtc });
});

api.get("/api/:date", (req, res) => {
  let date = req.params.date;
  if (/\d{5,}/.test(date)) {
    date = parseInt(date);
    req.json({ unix: date, utc: new Date(date).toUTCString() });
  } else {
    let newDate = new Date(date);
    if (newDate.toString() === "Invalid Date") {
      res.json({ error: newDate.toString() });
    } else {
      res.json({ unix: newDate.valueOf(), utc: newDate.toUTCString() });
    }
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
