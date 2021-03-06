import { getOneAndSend } from "../getOne";
import { connectToDB } from "../../db/dbConnector";
import schema from "../../db/schema.json";

export const getUserByEmail = async (email) => {
  
  const userColumnsExceptPassword = Object.keys(schema.user).filter(
    (key) => key !== "password"
    );
    const sql = `SELECT ${userColumnsExceptPassword} FROM user WHERE user.email = '${email}'`;
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
  const userColumnsExceptPassword = Object.keys(schema.user).filter(
    (key) => key !== "password"
  );
  const sql = `SELECT ${userColumnsExceptPassword} FROM user WHERE user.userId = '${userId}'`;
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
  const userColumnsExceptPassword = Object.keys(schema.user).filter(
    (key) => key !== "password"
  );
  const sql = `SELECT ${userColumnsExceptPassword} FROM user WHERE user.username = '${username}'`;
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);
    if (rows.length === 0) {
      return null;
    }
    console.log(rows[0]);
    
    return rows[0];
  } catch (err) {
    throw err;
  }
};

export const getPassword = async (userId) => {
  const sql = `SELECT password FROM user WHERE user.userId = '${userId}'`;
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0].password;
  } catch (err) {
    throw err;
  }
};
