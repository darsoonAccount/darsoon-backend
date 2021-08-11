import { getOneAndSend } from "../getOne";
import { connectToDB } from "../../db/dbConnector";

export const getUserByEmail = async (email) => {
  const sql = `SELECT * FROM users WHERE users.email = '${email}'`;
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (err) {
    throw err;
  }
};

export const getUserById = async (userId) => {
  const sql = `SELECT * FROM users WHERE users.userId = '${userId}'`;
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (err) {
    throw err;
  }
};

export const getUserByUsername = async (username) => {
  const sql = `SELECT * FROM users WHERE users.username = '${username}'`;
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (err) {
    throw err;
  }
};
