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

export const insertInDB = ({ sql }) => {
  const con = connectToDB();

  let error = null;
  let qResult = null;

  con.connect((err) => {
    if (err) error = err;
    con.query(sql, (err, result) => {
      if (err) error = err;
      qResult = result;
    });
  });

  return [error, qResult];
};

export const updateInDB = ({ sql }) => {
  const con = connectToDB();

  let error = null;
  let qResult = null;

  con.connect((err) => {
    if (err) error = err;
    con.query(sql, (err, result) => {
      if (err) error = err;
      // console.log(result.affectedRows + " record(s) updated");
      qResult = result;
    });
  });
  return [error, qResult];
};

export const deleteInDB = ({ sql }) => {
  const con = connectToDB();

  let error = null;
  let qResult = null;

  con.connect((err) => {
    if (err) error = err;
    con.query(sql, (err, result) => {
      if (err) error = err;
      // console.log("Number of records deleted: " + result.affectedRows);
      qResult = result;
    });
  });

  return [error, qResult];
};
