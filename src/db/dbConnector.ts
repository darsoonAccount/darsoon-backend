const mysql = require("mysql2/promise");
require("dotenv").config();

export const connectToDB = async () => {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
  };

  const con = await mysql.createPool(config);
  return con;
};
