"use strict";
import express, { Request, Response, NextFunction } from "express";

import {
  getUsers,
  getOneUser,
  addUser,
  updateUser,
  deleteUser,
  getTeachers,
  getOneTeacher,
  updateTeacher,
  deleteTeacher,
  addTeacher,
} from "./handlers";

// var bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
//this will give you HTTP requests log in console
app.use(cors());
app.use(morgan("tiny"));

// app.use(bodyParser.json());
app.use(express.json());

//requests for statics files will go to into the public folder.
// app.use(express.static("public"));

app
  .use(function (req: Request, res: Response, next: NextFunction) {
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

// endpoints -------------------------

//root endpoint
app.get("/", (req, res) => {
  res.send("Hello World from Darsoon Server");
});

//for each entity there are five endpoints: /api/example-entities, /example-entities/:id, /example-entities/:id/add, /example-entities/:id/update, /example-entities/:id/delete
//users 👤👤
app.get("/api/users", getUsers);
app.get("/api/users/:username", getOneUser);
app.post("/api/users/:username/add", addUser);
app.patch("/api/users/:username/update", updateUser);
app.delete("/api/users/:username/delete", deleteUser);

//teachers 👩‍🏫👨‍🏫

app.get("/api/teachers", getTeachers);
app.get("/api/teachers/:username", getOneTeacher);
app.post("/api/teachers/add", addTeacher);
app.patch("/api/teachers/:username/update", updateTeacher);
app.delete("/api/teachers/:username/delete", deleteTeacher);

//payers

//admins

//students

//topics

//expertises

//products

//classes

//withdraws

//sessions

//feedbacks

// this is the catch all endpoint ---------------------------------

app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Page Not Found",
  });
});

//listen on port 8000

app.listen(process.env.PORT || 8000, () => {
  console.log("listening on port 8000");
});
