import { setEnvironmentData } from "worker_threads";

const mysql = require("mysql2/promise");
require("dotenv").config();

export const connectToDB = async () => {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
  }

  const pool = await mysql.createPool(config);
  return pool;
};

interface IfindInDBParameters {
  sql: string;
}
export const findInDB = async ({ sql }: IfindInDBParameters) => {
  try {
    const con = await connectToDB();
    const [rows, fields] = await con.execute(sql);
    return [null, rows];
  } catch (error) {
    return [error, null];
  }
};

export const insertInDB = async ({ sql }: IfindInDBParameters) => {
  try {
    const con = await connectToDB();
    const [excutionResult, fields] = await con.execute(sql);
    return [null, excutionResult];
  } catch (error) {
    return [error, null];
  }
};


export const deleteInDB = async ({ sql }: IfindInDBParameters) => {
  try {
    const con = await connectToDB();
    await con.connect();
    const [rows, fields] = await con.execute(sql);
    return [null, rows];
  } catch (error) {
    console.log(error);
    return [error, null];
  }
};


