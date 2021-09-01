import { connectToDB } from "../db/dbConnector";
import schema from "../db/schema.json";
import tables from "../db/tables.json";
import { isValid } from "../validator";
import { genPK } from "../utils";
import bcrypt from "bcrypt";

//➕📄
//register User handler ---------------------------------------------------------------------

//users add handler -------------------------------------------------------------------------
export const addUser = async (req, res) => {
  const { username } = req.params;
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const data = { ...req.body, username, password: hashedPassword };
  const tableSchema = schema.users;
  await ValidateAddAndSend({
    req,
    res,
    entity: "user",
    table: "users",
    PKprefix: "usr",
    data,
    tableSchema,
  });
};

//profile add handler -------------------------------------------------------------------------
export const addProfile = async (req, res) => {
  const { typeOfUsers, username } = req.params;
  if (!["teachers", "admins", "payers", "students"].includes(typeOfUsers)) {
    res.status(404).json({
      status: 404,
      message: "Page Not Found",
    });
    return;
  }
  const data = { ...req.body };
  const tableSchema = schema[typeOfUsers];
  await ValidateAddAndSend({
    req,
    res,
    entity: tables[typeOfUsers].entity,
    table: typeOfUsers,
    PKprefix: tables[typeOfUsers].pkprefix,
    data,
    tableSchema,
  });
};

// entities add handler -------------------------------------------------------------------------
export const addEntity = async (req, res) => {
  const { entities } = req.params;

  if (!Object.keys(schema).includes(entities)) {
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
  const tableSchema = schema[entities];
  await ValidateAddAndSend({
    req,
    res,
    entity: tables[entities].entity,
    table: entities,
    PKprefix: tables[entities].pkprefix,
    data,
    tableSchema,
  });
};

// utility functions -------------------------------------------------------------------------

interface IvalidateAddAndSend {
  req: any;
  res: any;
  entity: string;
  PKprefix: string;
  data: any;
  dataPatternArray: any;
}

export const ValidateAddAndSend = async ({ req, res, entity, table, PKprefix, data, tableSchema }) => {
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
  const sql = `INSERT INTO ${table} (${entity}Id ,${keys}) VALUES ('${pk}', ${values})`;
  data = { ...data, [`${entity}Id`]: pk };
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
