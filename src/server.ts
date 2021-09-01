"use strict";
const morgan = require("morgan");
const express = require("express");
import { Request, Response, NextFunction } from "express";
const cors = require("cors");
const passport = require("passport");
const bcrypt = require("bcrypt");

import { loginUser, registerUser } from "./handlers/customeHandlers/authHandlers";
import { getUsers, getProfiles, getEntities, getJTeacherApplications, getByQuery } from "./handlers/getAll";
import { getOneUser, getOneProfile, getOneEntitiy, getJOneTeacherApplication } from "./handlers/getOne";
import { deleteUser, deleteProfile, deleteEntitiy } from "./handlers/deleteOne";
import { addUser, addProfile, addEntity } from "./handlers/addOne";
import { updateUser, updateProfile, updateEntity } from "./handlers/updateOne";
import { showSchema } from "./handlers/customeHandlers/showSchema";

const app = express();
app.use(cors()); //alows HTTP requests from browsers (a whitelist of domais is more secure).
app.use(morgan("tiny")); //this will give you HTTP requests log in console:
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static("public")); //requests for statics files will go to into the public folder.

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Methods", "OPTIONS, HEAD, GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static("./server/assets"));
app.use("/", express.static(__dirname + "/"));

//authentication

// const LocalStrategy = require("passport-local").Strategy; // no longer using local strategy.
const { jwtStrategy } = require("./passport/passportConfigJwt");
passport.use(jwtStrategy);
app.use(passport.initialize());

// app.use(require("./routes"));

//login and register endpoints

const authIt = passport.authenticate("jwt", { session: false });
app.post("/api/register", registerUser);
app.post("/api/login", loginUser);

app.get("/api/protected", authIt, (req, res) => {
  res.status(200).json({ message: "Yohoo, you are authenticated!" });
}); //for testing only. should be removed later %%%%%%%%%%

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
// app.post("/api/users/:username/add", addUser); //register endpoint instead should be used.
app.patch("/api/users/:username/update", updateUser);

//user profiles -- these endpoits are for teachers, payers, students and admins.
//these endpoints work with username. also the getters return a profile with user filds (usernam, firsname, lastname ,...)
app.get("/api/p/:typeOfUsers", getProfiles);
app.get("/api/p/:typeOfUsers/:username", getOneProfile);
app.delete("/api/p/:typeOfUsers/:username/delete", deleteProfile);
app.post("/api/p/:typeOfUsers/:username/add", addProfile);
app.patch("/api/p/:typeOfUsers/:username/update", updateProfile);

//auto joining endpoints (for each foreign key in the result, they append the data related to that foreign key to the result. this append data is in for of an object with the key of that entity)
app.get("/api/j/teacherApplications/:id", getJOneTeacherApplication);
app.get("/api/j/teacherApplications", getJTeacherApplications);

app.get("/api/q/", getByQuery);
//entities -- thses endpoints work for all tables including users, teachers, payers, students and admins.
// these endpoints work with the Primary Key of each table.
app.get("/api/:entities", getEntities); //becarefull this endpoint eats all requests like /api/something
app.get("/api/:entities/:id", getOneEntitiy);
app.delete("/api/:entities/:id/delete", deleteEntitiy);
app.post("/api/:entities/add", addEntity);
app.patch("/api/:entities/:id/update", updateEntity);

// this is the catch all endpoint ---------------------------------

app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Not Found!",
  });
});

//listen on port 8000

app.listen(process.env.PORT || 8000, () => {
  console.log("listening on port 8000");
});
