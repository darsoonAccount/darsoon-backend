import { connectToDB } from "../db/dbConnector";
import schema from "../db/schema.json";
import pkprefix from '../db/pkprefix.json';
import { isValid } from "../validator";
import { genPK } from "../utils";
import bcrypt from "bcrypt";

//➕📄
//register User handler ---------------------------------------------------------------------

//user add handler -------------------------------------------------------------------------
// better to remove this becasue register user is used for this purpose.
export const addUser = async (req, res) => {
  const { username } = req.params;
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const data = { ...req.body, username, password: hashedPassword };
  const tableSchema = schema.user;
  await ValidateAddAndSend({
    req,
    res,
    table: "user",
    PKprefix: "usr",
    data,
    tableSchema,
  });
};

//profile add handler -------------------------------------------------------------------------
export const addProfile = async (req, res) => {
  const { typeOfUser, username } = req.params;
  if (!["teacher", "admin", "payer", "student"].includes(typeOfUser)) {
    res.status(404).json({
      status: 404,
      message: "Page Not Found",
    });
    return;
  }
  const data = { ...req.body };
  const tableSchema = schema[typeOfUser];
  await ValidateAddAndSend({
    req,
    res,
    table: typeOfUser,
    PKprefix: pkprefix[typeOfUser],
    data,
    tableSchema,
  });
};

// entity add handler -------------------------------------------------------------------------
export const addEntity = async (req, res) => {
  const { table } = req.params;

  if (!Object.keys(schema).includes(table)) {
    res.status(404).json({
      status: 404,
      message: "Page Not Found",
    });
    return;
  }
  let data = req.body;
  const { password } = req.body;
  if (password) {
    const hashedPassword = await bcrypt(password, 10);
    data = { ...req.body, password: hashedPassword };
  }
  const tableSchema = schema[table];
  await ValidateAddAndSend({
    req,
    res,
    table,
    PKprefix: pkprefix[table],
    data,
    tableSchema,
  });
};

// utility functions -------------------------------------------------------------------------

interface IvalidateAddAndSend {
  req: any;
  res: any;
  table: string;
  PKprefix: string;
  data: any;
  dataPatternArray: any;
}

export const ValidateAddAndSend = async ({ req, res, table, PKprefix, data, tableSchema }) => {
  const [isDataValid, validationMessage] = isValid({
    data,
    tableSchema,
    isUpdating: false,
  });
  if (!isDataValid) {
    res.status(400).json({ status: 400, message: validationMessage });
    return;
  }
  const pk = genPK(PKprefix);
  const keys = Object.keys(data).filter((key) => data[key] !== null);
  const values = Object.values(data)
    .filter((value) => value !== null)
    .map((value) => `'${value}'`);
  const sql = `INSERT INTO ${table} (${table}Id ,${keys}) VALUES ('${pk}', ${values})`;
  data = { ...data, [`${table}Id`]: pk };
  await addOneAndSend({ req, res, sql, data });
};

const addOneAndSend = async ({ req, res, sql, data }) => {
  const con = await connectToDB();
  try {
    const [insertResult, fields] = await con.execute(sql);
    if (insertResult.affectedRows === 1) {
      res.status(200).json({ status: 200, message: "succefully added", data });
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
