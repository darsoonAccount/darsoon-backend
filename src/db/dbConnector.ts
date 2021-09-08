import { getScehma } from "../handlers/customeHandlers/showSchema";

const fs = require("fs");

const mysql = require("mysql2/promise");
require("dotenv").config();

export const pool = null;

export const connectToDB = async () => {
  if (!pool) {
    const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql";

    const config = {
      connectionLimit: 99,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    };

    const newPool = await mysql.createPool(config);

    return newPool;
  } else {
    return pool;
  }
};

export const updateSchemaFile = async () => {
  const schema = await getScehma();
  console.log("here1");
  const schemaStringified = JSON.stringify(schema);
  fs.writeFileSync("src/db/schema.json", schemaStringified);
  console.log("here2");
  return schema;
};
