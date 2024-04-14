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

app.get("/api/:date?", (req, res) => {
  let date = req.params.date;
  let isValidDate = Date.parse(date);
  let isValidUnix = /^[0-9]+$/.test(date);
  let isEmpty = date == "" || date == null;
  let unix_output = 0;
  let utc_output = "";
  if (isValidDate) {
    unix_output = new Date(date);
    utc_output = unix_output.toUTCString();
    return res.json({ unix: unix_output.valueOf(), utc: utc_output });
  } else if (isNaN(isValidDate) && isValidUnix) {
    unix_output = new Date(parseInt(date));
    utc_output = unix_output.toUTCString();
    return res.json({ unix: unix_output.valueOf(), utc: utc_output });
  } else if (isEmpty) {
    unix_output = new Date();
    utc_output = unix_output.toUTCString();
    return res.json({ unix: unix_output.valueOf(), utc: utc_output });
  } else {
    res.json({ error: "Invalid Date" });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
