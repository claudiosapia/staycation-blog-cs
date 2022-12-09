const { rejects } = require("assert");
const express = require("express");
const app = express();
require('dotenv').config();

const mongoose = require("mongoose");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

app.use("/public", express.static(__dirname + "/public"));
app.use("/public", express.static(__dirname + "/"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", __dirname + "/public/views");
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
// ?retryWrites=true&w=majority";



var url = process.env.MONGODB_ATLAS_KEY
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

const db = mongoose.connection;
db.once("open", function () {
  console.log("Connected to the DB");
});
const BlogSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  location: String,
  url: String,
  tags: String,
  dateStart: String,
  dateEnd: String,
  files: Buffer,
  key: String,
});

const BlogModel = mongoose.model("articles", BlogSchema);

app.get("/", (req, res) => {
  var data = BlogModel.find({}, function (err, docs) {
    if (err) throw err;
    res.render("display", { items: docs });
  });
});
// title, author, description, location, url, dateStart, dateEnd, files, trimmedText, key

app.post("/add", (req, res) => {
  var {
    title,
    author,
    description,
    location,
    url,
    dateStart,
    dateEnd,
    files,
    tags,
    key,
  } = req.body;
  var dateObj = new Date();
  var currentDate = dateObj.toUTCString();
  date = currentDate;
  key = Date.now();

  var Objects = {
    date,
    title,
    author,
    description,
    location,
    url,
    dateStart,
    dateEnd,
    files,
    tags,
    key,
  };

  const Datatobestored = new BlogModel(Objects);
  Datatobestored.save();
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  var {
    title,
    author,
    description,
    location,
    url,
    dateStart,
    dateEnd,
    files,
    tags,
    key,
  } = req.body;

  var query = {
    title,
    author,
    description,
    location,
    url,
    dateStart,
    dateEnd,
    files,
    tags,
  };

  BlogModel.findOneAndUpdate(
    { key: Number(key) },
    query,
    function (err, result) {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

app.get("/edit/:key", function (req, res) {
  var { key } = req.params;

  BlogModel.findOne({ key: Number(key) }, (err, docs) => {
    if (err) throw err;

    res.render("edit", { data: docs });
  });
});

app.get("/add", function (req, res) {
  res.render("add");
});

app.post("/delete", (req, res) => {
  var selected = req.body.selected;
  selected = Number(selected);
  console.log(selected);

  BlogModel.deleteOne({ key: selected }, err => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.post("/view", function (req, res) {
  var { target } = req.body;
});

app.get("/view/:key", function (req, res) {
  var { key } = req.params;

  BlogModel.findOne({ key: Number(key) }, (err, docs) => {
    if (err) throw err;

    res.render("view", { items: docs });
  });
});

app.post("/search", (req, res) => {
  var { query } = req.body;

  BlogModel.findOne({ query });
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port 3000");
});
