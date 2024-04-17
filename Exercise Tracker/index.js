const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI);

const UserSchema = new Schema({
  username: String,
});
const User = mongoose.model("User", UserSchema);

const ExerciseSchema = new Schema({
  user_id: { type: String, requrired: true },
  description: String,
  duration: Number,
  date: Date,
});
const Exercise = mongoose.model("Exercise", ExerciseSchema);

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", async (req, res) => {
  const users = await User.find({}).select("_id username");
  if (!users) {
    res.send("No users found");
  } else {
    res.json(users);
  }
});

app.post("/api/users", async (req, res) => {
  const userObj = new User({ username: req.body.username });

  try {
    const user = await userObj.save();
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.params._id;
  const { description, duration, date } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found");
    } else {
      const exceriseObj = new Exercise({
        user_id: user._id,
        description,
        duration,
        date: date ? new Date(date) : new Date(),
      });
      const exercise = await exceriseObj.save();
      res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString(),
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const id = req.params._id;
  const { from, to, limit } = req.query;
  const user = await User.findById(id);
  if (!user) {
    res.send("User not found");
    return;
  }
  let dateObj = {};
  if (from) {
    dateObj["$gte"] = new Date(from);
  }
  if (to) {
    dateObj["$lte"] = new Date(to);
  }
  let filter = { user_id: id };
  if (from || to) {
    filter.date = dateObj;
  }

  const exercises = await Exercise.find(filter).limit(+limit || 500);

  res.json({
    username: user.username,
    count: exercises.length,
    _id: user._id,
    log: exercises.map((ex) => ({
      description: ex.description,
      duration: ex.duration,
      date: new Date(ex.date).toDateString(),
    })),
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
