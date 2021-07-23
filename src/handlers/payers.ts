import { connectToDB, findInDB, insertInDB, deleteInDB } from "../dbConnector";
import {
  deleteOneAndSend,
  findUserId,
  genPK,
  getAllAndSend,
  getOneAndSend,
} from "../utils";

//Users 👤👤 &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

//📄📄📄
export const getPayers = async (req, res) => {
  const sql = `SELECT * FROM payers INNER JOIN users ON payers.userId = users.userId`;
  await getAllAndSend({ sql, req, res });
};

//📄
export const getOnePayer = async (req, res) => {
  const { username } = req.params;
  const sql = `SELECT * FROM payers INNER JOIN users ON payers.userId=users.userId WHERE username = '${username}'`;
  await getOneAndSend({ req, res, sql });
};

//🚮
export const deletePayer = async (req, res) => {
  const { username } = req.params;
  const sql = `DELETE payers.* FROM payers INNER JOIN users ON payers.userId = users.userId WHERE users.username = '${username}'`;
  await deleteOneAndSend({ req, res, sql });
};

//➕📄
export const addPayer = async (req, res) => {
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
export const updatePayer = async (req, res) => {
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
