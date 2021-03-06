import { connectToDB, updateSchemaFile } from "../../db/dbConnector";
const fs = require("fs");

export const showSchema = async (req, res) => {
  try {

    const schema  = await getScehma();
    
    res.status(200).json(schema);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message, messageFa: error.message });
  }
}

export const updateSchema = async (req, res) => {
  try {
    const schema = await updateSchemaFile();
    res.status(200).json(schema);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message, messageFa: error.message });
  }
};

export const getScehma = async () => {
  try {
    let tables = await getTablesFromDB();

    let schemaArr = await Promise.all(
      tables.map(async (table) => {
        let columns = await getColumnsOf(table);
        return await [table, columns];
      })
    );

    let schema = {};
    schemaArr.forEach((item: any) => {
      const [table, columns] = item;
      schema[table] = columns;
    });
    return schema;
  } catch (err) {
    throw err;
  }
};

export const getColumnsOf = async (table) => {
  const con = await connectToDB();
  try {
    const sql = `show columns FROM ${table}`;
    const result = await con.execute(sql);
    let columns = {};
    result[0].forEach((column) => {
      columns[column.Field] = column;
    });
    return columns;
  } catch (err) {
    throw err;
  }
};

const getTablesFromDB = async () => {
  const con = await connectToDB();
  try {
    const sql = "show tables";
    const result = await con.execute(sql);
    const tables = result[0].map((item) => item.Tables_in_darsoon);
    return tables;
  } catch (err) {
    throw err;
  }
};

export const getColumnNamesOf = async (table) => {
  const con = await connectToDB();
  try {
    const sql = `show columns FROM ${table}`;
    const result = await con.execute(sql);
    const ColumnNames = result[0].map((col) => col.Field);

    return ColumnNames;
  } catch (err) {
    throw err;
  }
};
