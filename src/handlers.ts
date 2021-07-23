import { send } from "process";
import { stringify } from "qs";
import { connectToDB, findInDB, insertInDB, deleteInDB } from "./dbConnector";
import { genPK } from "./utils";

//Users 👤👤 &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

//📄📄📄
export const getUsers = async (req, res) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(`SELECT * FROM users`);
    res.status(200).json({ status: 200, message: "success", data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

//📄
export const getOneUser = async (req, res) => {
  const { username } = req.params;
  const pool = await connectToDB();
  try {
    const [rows, fields] = await pool.execute(
      `SELECT * FROM users WHERE users.username = '${username}'`
    );
    if (rows.length === 0) {
      res
        .status(400)
        .json({ status: 400, message: "There is no user with this username." });
    }
    res.status(200).json({ status: 200, message: "success", data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

//➕📄
export const addUser = async (req, res) => {
  const { username } = req.params;
  const { firstname, lastname, password, email } = req.body;
  if (!username || !firstname || !lastname || !password || !email) {
    res
      .status(400)
      .json({ status: 400, message: "Please provide all required data." });
  }
  const userId = genPK("usr");
  const con = await connectToDB();
  try {
    const sql = `INSERT INTO users (userId, username, firstname, lastname, email, password) VALUES ('${userId}', '${username}', '${firstname}' , '${lastname}' , '${email}', '${password}')`;
    const [insertResult, fields] = await con.execute(sql);
    if (insertResult.affectedRows === 1) {
      res.status(200).json({ status: 200, message: "user added" });
    }
  } catch (err) {
    if (err.message.includes("dup")) {
      res.status(400).json({ status: 400, message: err.message });
    } else {
      res.status(500).json({ status: 500, message: err.message });
    }
  }
};

//📝
export const updateUser = async (req, res) => {
  const { username } = req.params;
  const { firstname, lastname, password, email } = req.body;
  const update = { firstname, lastname, password, email };

  let assignments = "";
  Object.keys(update).forEach((key) => {
    if (update[key]) {
      assignments = assignments + `, ${key} = '${update[key]}'`;
    }
  });
  if (assignments.length === 0) {
    res.status(400).json({
      status: 400,
      message: "Please provide fields you want to update",
    });
  }
  assignments = assignments.substring(1);

  const con = await connectToDB();
  try {
    const sql = `UPDATE users SET ${assignments} WHERE username = '${username}'`;
    console.log(sql);

    const [updateResult, fields] = await con.execute(sql);
    if (updateResult.affectedRows === 1) {
      res.status(200).json({ status: 200, message: "user updated" });
    }
  } catch (err) {
    if (true) {
      res.status(400).json({ status: 400, message: err.message });
    } else {
      res.status(500).json({ status: 500, message: err.message });
    }
  }
};
//🚮
export const deleteUser = async (req, res) => {
  const { username } = req.params;
  const pool = await connectToDB();
  try {
    const [deleteResult, fields] = await pool.execute(
      `DELETE FROM users WHERE users.username = '${username}'`
    );
    if (deleteResult.affectedRows === 0) {
      res
        .status(400)
        .json({ status: 400, message: "There is no user with this username." });
    }
    res.status(200).json({ status: 200, message: "user deleted" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

// Teachers handlers 👩‍🏫👨‍🏫  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
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

  const [err, data] = await findInDB({
    sql: `SELECT * FROM teachers INNER JOIN users ON teachers.userId=users.userId WHERE username = '${username}'`,
  });
  if (err) {
    res.status(500).json({ status: 500, messeage: err.message });
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
  // const { username } = req.params;
  // check if req.body is not empty
  // check if all values in req.body are not empty.
  // if (Object.keys(req.body).length === 0 || Object) {
  //   res
  //     .status(400)
  //     .json({ status: 400, message: "Please provide updated information" });
  //   return;
  // }
};

export const deleteTeacher = async (req, res) => {
  const { username } = req.params;
  const con = await connectToDB();
  try {
    await con.beginTransaction();

    const [userRows, userFields] = await con.execute(
      `SELECT users WHERE users.username = '${username}`
    );
    const userId = userRows[0].userId;
    const [deleteResult, deleteFields] = await con.execute(
      `DELETE teachers WHERE teachers.userId = '${userId}`
    );
    await con.commit();
    if (deleteResult.affectedRows === 0) {
      res.json({ status: 400, message: "No teacher with this username" });
    } else {
      res.status(200).json({ status: 200, message: "Teacher deleted" });
    }
  } catch (error) {
    con.rollback();
    console.log(error);
    res.status(500).json({ status: 500, messeage: error.message });
  } finally {
    await con.close();
  }
};

export const addTeacher = async (req, res) => {
  //validate data
  const { username, firstname, lastname, password, email } = req.body;
  if (!username || !firstname || !lastname || !password || !email) {
    res
      .status(400)
      .json({ status: 400, message: "Please provide all required data." });
  }
  const userId = genPK("user");
  const teacherId = genPK("teacher");
  //insert data
  const con = await connectToDB();
  try {
    await con.beginTransaction();
    const sql1 = `INSERT INTO users (userId, username, firstName, lastName, email, password, role) VALUES ('${userId}', '${username}', '${firstname}' , '${lastname}' , '${email}', '${password}')`;
    const [insertResutl1, fields1] = await con.execute({ sql1 });
    const sql2 = `INSERT INTO teachers (teacherId, userId) VALUES ('${teacherId}', '${userId}')`;
    const [insertResult2, fields2] = await con.execute({ sql2 });
  } catch (error) {
    res.status(500).json({ status: 500, messeage: error.message });
  }
  //send result
  // if (err1 || err2)
  //   res.status(201).json({ status: 201, message: "teacher added" });
};
