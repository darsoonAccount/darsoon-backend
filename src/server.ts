"use strict";
import express, { Request, Response, NextFunction } from "express";

import {
  getUsers,
  getOneUser,
  addUser,
  updateUser,
  deleteUser,
} from "./handlers/users";

import {
  getTeachers,
  getOneTeacher,
  updateTeacher,
  deleteTeacher,
  addTeacher,
} from "./handlers/teachers";

import {
  getPayers,
  getOnePayer,
  addPayer,
  updatePayer,
  deletePayer,
} from "./handlers/payers";

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
app.delete("/api/users/:username/delete", deleteUser);
app.post("/api/users/:username/add", addUser);
app.patch("/api/users/:username/update", updateUser);

//teachers 👩‍🏫👨‍🏫
app.get("/api/teachers", getTeachers);
app.get("/api/teachers/:username", getOneTeacher);
app.delete("/api/teachers/:username/delete", deleteTeacher);
app.post("/api/teachers/:username/add", addTeacher);
app.patch("/api/teachers/:username/update", updateTeacher);

//payers
app.get("/api/payers", getPayers);
app.get("/api/payers/:username", getOnePayer);
app.delete("/api/payers/:username/delete", deletePayer);
app.post("/api/payers/:username/add", addPayer);
app.patch("/api/payers/:username/update", updatePayer);

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
