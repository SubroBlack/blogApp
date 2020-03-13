const express = require("express");
const app = express();
const config = require("./utils/config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const blogsRouter = require("./controllers/blogs");

console.log("Connecting to MongoDB");

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true }).then(() => {
  console.log("Connected to MongoDB");
});

app.use(cors());
app.use(bodyParser.json());

app.use("/api/blogs", blogsRouter);

module.exports = app;
