const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const blogsRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");

console.log("Connecting to MongoDB");

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true }).then(() => {
  console.log("Connected to MongoDB");
});

app.use(cors());
app.use(bodyParser.json());

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
