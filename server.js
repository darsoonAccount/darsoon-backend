"use strict";

const {
    handleGetTest,
    handlePostTest

} = require("./handlers");

const express = require("express");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const port_number = process.env.PORT || 8000;

const app = express();
//this will give you HTTP requests log in console
app.use(cors());
app.use(morgan("tiny"));

app.use(bodyParser());

//requests for statics files will go to into the public folder.
// app.use(express.static("public"));

app
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(express.static("./server/assets"))
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"));

//endpoints ------------------------------------------------------
app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "Darsoon Backend v0.1 - for more informations and documentations please visit:https://github.com/hamidkd/darsoon-backend"
    );
});
app.post("/api/getTest", handleGetTest);
app.post("/api/postTest", handlePostTest);



// this is the catch all endpoint ---------------------------------

app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Page Not Found",
  });
});

//listen on port 8000

app.listen(port_number, () => {
  console.log("listening on port 8000");
});
