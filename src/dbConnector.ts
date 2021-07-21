import { setEnvironmentData } from "worker_threads";

const mysql = require("mysql2/promise");
require("dotenv").config();

export const connectToDB = async () => {
  const con = await mysql.createConnection({
    //should be repalce with pool
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
  });
  return con;
};

interface IfindInDBParameters {
  sql: string;
}
export const findInDB = async ({ sql }: IfindInDBParameters) => {
  try {
    const con = await connectToDB();
    await con.connect();
    const [rows, fields] = await con.execute(sql);
    return [null, rows];
  } catch (error) {
    return [error, null];
  }
};

export const insertInDB = async ({ sql }: IfindInDBParameters) => {
  try {
    const con = await connectToDB();
    await con.connect();
    const [excutionResult, fields] = await con.execute(sql);
    return [null, excutionResult];
  } catch (error) {
    return [error, null];
  }
};
