"use strict";
import express, { Request, Response, NextFunction } from "express";

import { getUsers, getProfiles, getEntities } from "./handlers/getAll";
import { getOneUser, getOneProfile, getOneEntitiy } from "./handlers/getOne";
import { deleteUser, deleteProfile, deleteEntitiy } from "./handlers/deleteOne";
import { addUser, addProfile, addEntity } from "./handlers/addOne";
import { updateUser, updateProfile, updateEntity } from "./handlers/updateOne";
import { getUserByEmail } from "./handlers/customeHandlers/getUserByEmail";

import { showSchema } from "./handlers/customeHandlers/showSchema";

const morgan = require("morgan");
const cors = require("cors");

const passport = require("passport");
const { initPassport } = require("./passportConfig");

initPassport(passport, getUserByEmail);

const app = express();
app.use(cors());
//this will give you HTTP requests log in console:
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

//authentication
app.use(passport.initialize());

//login endpoint
app.post(
  "/api/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    res.status(200).json({ status: 200, message: "authenticated!!!" });
  }
);

// endpoints -------------------------

//root endpoint
app.get("/", (req, res) => {
  res.send("Hello World from Darsoon Server");
});

//show data schema
app.get("/api/schema", showSchema);

//users -- these endpoints are for users table. these endpoint work with usename.
app.get("/api/users", getUsers);
app.get("/api/users/:username", getOneUser);
app.delete("/api/users/:username/delete", deleteUser);
app.post("/api/users/:username/add", addUser);
app.patch("/api/users/:username/update", updateUser);

//user profiles -- these endpoits are for teachers, payers, students and admins.
//these endpoints work with username. also the getters return a profile with user filds (usernam, firsname, lastname ,...)
app.get("/api/p/:typeOfUsers", getProfiles);
app.get("/api/p/:typeOfUsers/:username", getOneProfile);
app.delete("/api/p/:typeOfUsers/:username/delete", deleteProfile);
app.post("/api/p/:typeOfUsers/:username/add", addProfile);
app.patch("/api/p/:typeOfUsers/:username/update", updateProfile);

//entities -- thses endpoints work for all tables including users, teachers, payers, students and admins.
// these endpoints work with the Primary Key of each table.
app.get("/api/:entities", getEntities);
app.get("/api/:entities/:id", getOneEntitiy);
app.delete("/api/:entities/:id/delete", deleteEntitiy);
app.post("/api/:entities/add", addEntity);
app.patch("/api/:entities/:id/update", updateEntity);

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
