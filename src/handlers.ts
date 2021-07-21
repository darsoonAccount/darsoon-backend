import { send } from "process";
import { connectToDB, findInDB, insertInDB } from "./dbConnector";
import { genPK } from "./utils";

// Teachers handlers 👩‍🏫👨‍🏫  ***********************************************
export const getTeachers = async (req, res) => {
  const [err, data] = await findInDB({
    sql: `SELECT * FROM teachers INNER JOIN users ON teachers.userId=users.userId`,
  });
  if (err) {
    res.status(500).json({ status: 500, messeage: err });
    return;
  }
  res.status(200).json({ status: 200, message: "Ok", data: data });
};

export const getOneTeacher = async (req, res) => {
  const { username } = req.params;
  console.log("ususus", username);

  const [err, data] = await findInDB({
    sql: `SELECT * FROM teachers INNER JOIN users ON teachers.userId=users.userId WHERE username = '${username}'`,
  });
  if (err) {
    res.status(500).json({ status: 500, messeage: err });
    return;
  }
  if (!data || data.length === 0) {
    res
      .status(400)
      .json({ status: 400, message: "No teacher with this username" });
    return;
  }
  res.status(200).json({ status: 200, message: "Ok", data: data[0] });
  return;
};

export const updateTeacher = async (req, res) => {
  console.log("fake update teacher");
};

export const deleteTeacher = async (req, res) => {
  console.log("fake delete teacher");
};

export const addTeacher = async (req, res) => {
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
  const [err1, res1] = await insertInDB({ sql: sql1 }); //rollback is needed for when the next query does not work.
  let sql2 = `INSERT INTO teachers (teacherId, userId) VALUES ('${teacherId}', '${userId}')`;
  const [err2, res2] = await insertInDB({ sql: sql2 });
  //send result
  if (err1 || err2)
    res.status(500).json({ status: 500, messeage: err1.message });
  res.status(201).json({ status: 201, message: "teacher added" });
};
