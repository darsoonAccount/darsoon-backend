import { getScehma } from "../handlers/customeHandlers/showSchema";

const fs = require("fs");

const mysql = require("mysql2/promise");
require("dotenv").config();

export const connectToDB = async () => {
  const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql";

  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  };

  const con = await mysql.createPool(config);
  return con;
};

export const updateSchemaFile = async () => {
  const schema = await getScehma();
  console.log("here1");
  const schemaStringified = JSON.stringify(schema);
  fs.writeFileSync("src/db/schema.json", schemaStringified);
  console.log("here2");
  return schema;
};
