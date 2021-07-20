const mysql = require("mysql");
require("dotenv").config();

export const connectToDB = () => {
  const con = mysql.createConnection({
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
  const con = await connectToDB();

  let error = null;
  let data = null;

  con.connect((err) => {
    if (err) error = err;
    con.query(sql, (err, result, fields) => {
      if (err) error = err;
      data = result;
    });
  });

  return [error, data];
};

export const insertInDB = ({sql}) => {
  const con = await connectToDB();

  let error = null;
  let qResult = null;

  con.connect((err) => {
    if (err) error = err;
    con.query(sql, function (err, result) {
      if (err) error = err;
      qResult = result;
      });   
  });

  return [error, qResult]




