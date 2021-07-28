import { connectToDB } from "./dbConnector";
import { isValid } from "./validator";

export const genPK = (str: string): string => {
  const d = new Date("January 01, 2020 00:00:00 GMT+00:00");
  const now = new Date();
  const milisecs = now.getTime() - d.getTime();
  return `${str}-${milisecs}`;
};

export const isDuplicate = async ({ sql }) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);
    if (rows.length === 1) {
      return [null, true];
    } else {
      return [null, false];
    }
  } catch (error) {
    return [error, null];
  }
};
export const findUserId = async ({ username }) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(
      `SELECT * FROM users WHERE users.username = '${username}'`
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0].userId;
  } catch (error) {
    return null;
  }
};

export const getAllAndSend = async ({ req, res, sql }) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);
    res.status(200).json({ status: 200, message: "success", data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};
///???
export const showTables = async ({ req, res, sql }) => {
  const con = await connectToDB();
  const result = await con.execute(sql);
  res.status(200).json({ message: result[0] });
};
//????
export const showColumns = async ({ req, res, sql }) => {
  const con = await connectToDB();
  const result = await con.execute(sql);
  res.status(200).json({ message: result[0] });
};

export const getOneAndSend = async ({ req, res, sql }) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);
    if (rows.length === 0) {
      res.status(400).json({ status: 400, message: "bad request" });
      return;
    }
    res.status(200).json({ status: 200, message: "success", data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

export const deleteOneAndSend = async ({ req, res, sql }) => {
  const con = await connectToDB();
  try {
    const [deleteResult, fields] = await con.execute(sql);
    if (deleteResult.affectedRows === 0) {
      res.status(400).json({ status: 400, message: "bad request" });
    }
    res.status(200).json({ status: 200, message: "succefully deleted" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

export const addOneAndSend = async ({ req, res, sql }) => {
  const con = await connectToDB();
  try {
    const [insertResult, fields] = await con.execute(sql);
    if (insertResult.affectedRows === 1) {
      res.status(200).json({ status: 200, message: "succefully added" });
      return;
    }
  } catch (err) {
    if (err.message.includes("Dup")) {
      res.status(400).json({ status: 400, message: err.message });
      return;
    } else {
      res.status(500).json({ status: 500, message: err.message });
      return;
    }
  }
};
interface IvalidateAddAndSend {
  req: any;
  res: any;
  entity: string;
  PKprefix: string;
  data: any;
  dataPatternArray: any;
}
export const ValidateAddAndSend = async ({
  req,
  res,
  entity,
  table,
  PKprefix,
  data,
  tableSchema,
  checkNulls,
}) => {
  const isDataValid = isValid({ data, tableSchema, checkNulls });
  if (!isDataValid) {
    res
      .status(400)
      .json({ status: 400, message: "Please provide all required data." });
    return;
  }
  const pk = genPK(PKprefix);
  const keys = Object.keys(data);
  const values = Object.values(data).map((value) => `'${value}'`);
  const sql = `INSERT INTO ${table} (${entity}Id ,${keys}) VALUES ('${pk}', ${values})`;
  await addOneAndSend({ req, res, sql });
};

const createInsertSql = (dataPatternArray, data, PKprefix, entity) => {
  const pk = genPK(PKprefix);
  const keys = dataPatternArray.map((dataPettrnItem) => dataPettrnItem[0]);
  const values = dataPatternArray.map(
    (dataPettrnItem) => `'${data[dataPettrnItem[0]]}'`
  );
  const sql = `INSERT INTO ${entity}s (${entity}Id ,${keys}) VALUES ('${pk}', ${values})`;
  return sql;
};

export const updateOneAndSend = async ({ req, res, sql }) => {
  const con = await connectToDB();
  try {
    const [updateResult, fields] = await con.execute(sql);
    if (updateResult.affectedRows === 1) {
      res.status(200).json({ status: 200, message: "succesfully updated" });
      return;
    } else {
      res.status(500).json({ status: 400, message: "bad request" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};
