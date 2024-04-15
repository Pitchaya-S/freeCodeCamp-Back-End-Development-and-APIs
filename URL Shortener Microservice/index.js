require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");
const fs = require("fs");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

function dataManipulation(action, input) {
  let filePath = "./public/data.json";
  if (!fs.existsSync(filePath)) {
    fs.closeSync(fs.openSync(filePath, "w"));
  }

  let file = fs.readFileSync(filePath);
  if (action == "save" && input != null) {
    if (file.length == 0) {
      fs.writeFileSync(filePath, JSON.stringify([input], null, 2));
    } else {
      let data = JSON.parse(file.toString());
      let inputExist = [];
      inputExist = data.map((d) => d.original_url);
      let check_input = inputExist.includes(input.original_url);
      if (check_input === false) {
        data.push(input);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      }
    }
  } else if (action == "load" && input == null) {
    if (file.length == 0) {
      return;
    } else {
      let dataArray = JSON.parse(file);
      return dataArray;
    }
  }
}

function genShortURL() {
  let allData = dataManipulation("load");
  let min = 1;
  let max = 1000;
  if (allData != undefined && allData.length > 0) {
    max = allData.length * 1000;
  }
  let shortURL = Math.ceil(Math.random() * (max - min + 1) + min);

  if (allData === undefined) {
    return shortURL;
  } else {
    let shortExist = allData.map((d) => d.short_url);
    let checkShort = shortExist.includes(shortURL);
    if (checkShort) {
      genShortURL();
    } else {
      return shortURL;
    }
  }
}

app.post("/api/shorturl", (req, res) => {
  let input = "",
    domain = "",
    param = "",
    shortURL = 0;

  input = req.body.url;
  if (input === null || input === "") {
    return res.json({ error: "invalid url" });
  }

  domain = input.match(
    /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/gim
  );
  param = domain[0].replace(/^https?:\/\//i, "");

  dns.lookup(param, (err, url_Ip) => {
    if (err) {
      console.log(url_Ip);
      return res.json({ error: "invalid url" });
    } else {
      shortURL = genShortURL();
      dict = { original_url: input, short_url: shortURL };
      dataManipulation("save", dict);
      return res.json(dict);
    }
  });
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  let input = Number(req.params.shorturl);
  let allData = dataManipulation("load");
  let shortExist = allData.map((d) => d.short_url);
  let checkShort = shortExist.includes(input);
  if (checkShort && allData != undefined) {
    data_found = allData[shortExist.indexOf(input)];
    res.redirect(data_found.original_url);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
