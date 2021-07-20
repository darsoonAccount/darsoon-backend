import { send } from "process";
import { connectToDB, findInDB, insertInDB } from "./dbConnector";
import { genPK } from "./utils";

// Teachers handlers 👩‍🏫👨‍🏫

const getTeachers = async (req, res) => {
  const [err, data] = findInDB({
    sql: "SELECT * FROM teachers INNER JOIN users ON teachers.userId=users.userId",
  });

  if (err) res.status(500).json({ status: 500, messeage: err });
  res.status(500).json({ status: 200, message: "Ok", data });
};

const getOneTeacher = async (req, res) => {
  console.log("fake get one teacher");
};

const updateTeacher = async (req, res) => {
  console.log("fake update teacher");
};

const deleteTeacher = async (req, res) => {
  console.log("fake delete teacher");
};

const addTeacher = async (req, res) => {
  console.log("HEREEEE?");

  //validate data
  const { firstname, lastname, password, email } = req.body;
  if (!firstname || !lastname || !password || !email) {
    res
      .status(400)
      .json({ status: 400, message: "Please provide all required data." });
  }

  const userId = genPK("user");
  const teacherId = genPK("teacher");

  //insert data
  const sql1 = `INSERT INTO users (userId, firstName, lastName, email, password, role) VALUES ('${userId}', '${firstname}' , '${lastname}' , '${email}', '${password}' , 'teacher')`;
  const [err1, res1] = insertInDB({ sql: sql1 }); //rollback is needed for when the next query does not work.
  let sql2 = `INSERT INTO teachers (teacherId, userId) VALUES ('${teacherId}', '${userId}')`;
  const [err2, res2] = insertInDB({ sql: sql2 });

  //send result
  if (err1 || err2) res.status(500).json({ status: 500, messeage: err });
  res
    .status(200)
    .json({ status: 201, message: "teacher added", data: req.body });
};

module.exports = {
  getTeachers,
  getOneTeacher,
  updateTeacher,
  deleteTeacher,
  addTeacher,
};
