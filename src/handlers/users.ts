import { connectToDB, findInDB, insertInDB, deleteInDB } from "../dbConnector";
import { genPK } from "../utils";

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
      return;
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
      return;
    }
  } catch (err) {
    if (err.message.includes("Dup")) {
      res.status(400).json({ status: 400, message: err.message });
      return;
    } else {
      res.status(500).json({ status: 500, message: err.message });
      return;
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
    return;
  }
  assignments = assignments.substring(1);

  const con = await connectToDB();
  try {
    const sql = `UPDATE users SET ${assignments} WHERE username = '${username}'`;
    console.log(sql);

    const [updateResult, fields] = await con.execute(sql);
    if (updateResult.affectedRows === 1) {
      res.status(200).json({ status: 200, message: "user updated" });
      return;
    } else {
      res
        .status(500)
        .json({ status: 400, message: "There is no user with this username." });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
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
