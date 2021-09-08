import { connectToDB } from "../db/dbConnector";
import { isValid } from "../validator";
import { genPK, findUserId, findPk } from "../utils";
import schema from "../db/schema.json";
import pkprefix from '../db/pkprefix.json';
import bcrypt from "bcrypt";

// 📝
//user  update handler -------------------------------------------------------------------------
export const updateUser = async (req, res) => {
  const { username } = req.params;
  let data = req.body;
  const { password } = req.body;
  if (password) {
    const hashedPassword = await bcrypt(password, 10);
    data = { ...req.body, password: hashedPassword };
  }
  const tableSchema = schema.user;

  const pk = await findUserId(username);
  if (pk === null) {
    res.status(400).json({ status: 400, message: "There is no user with this username.", messageFa: "کاربری با این نام کاربری وجود ندارد." });
    return;
  }

  await ValidateUpdateAndSend({
    req,
    res,
    table: "user",
    pkprefix: pkprefix.user,
    pk,
    data,
    tableSchema,
  });
};

//profiles update handler -------------------------------------------------------------------------
export const updateProfile = async (req, res) => {
  const { username, typeOfUser } = req.params;
  const data = req.body;
  const tableSchema = schema[typeOfUser];
  const table = typeOfUser;

  const pk = await findPk({ username, table: typeOfUser });
  if (pk === null) {
    res.status(400).json({ status: 400, message: "There is no user with this username.", messageFa: "کاربری با این نام کاربری وجود ندارد."  });
    return;
  }

  await ValidateUpdateAndSend({
    req,
    res,
    table: typeOfUser,
    pkprefix: pkprefix[typeOfUser],
    pk,
    data,
    tableSchema,
  });
};

//entity update handler -------------------------------------------------------------------------
export const updateEntity = async (req, res) => {
  const { id, table } = req.params;
  let data = req.body;
  const { password } = req.body;
  if (password) {
    const hashedPassword = await bcrypt(password, 10);
    data = { ...req.body, password: hashedPassword };
  }
  const tableSchema = schema[table];

  await ValidateUpdateAndSend({
    req,
    res,
    table,
    pkprefix: pkprefix[table],
    pk: id,
    data,
    tableSchema,
  });
};

// utility functions -------------------------------------------------------------------------
const ValidateUpdateAndSend = async ({ req, res, table, pkprefix, pk, data, tableSchema }) => {
  const [isDataValid, validationMessage] = isValid({
    data,
    tableSchema,
    isUpdating: false,
  });
  if (!isDataValid) {
    res.status(400).json({ status: 400, message: validationMessage , messageFa: validationMessage });
    return;
  }
  let setAssignements = Object.keys(data).map((key) => {
    if (data[key] === null) {
      return `${key} = NULL`;
    }
    return `${key} = '${data[key]}'`;
  });
  const sql = `UPDATE ${table} SET ${setAssignements} WHERE  ${table}Id = '${pk}'`;
  data = { ...data, [`${table}Id`]: pk };
  await updateOneAndSend({ req, res, sql, data });
};

const updateOneAndSend = async ({ req, res, sql, data }) => {
  const con = await connectToDB();
  try {
    const [updateResult, fields] = await con.execute(sql);
    if (updateResult.affectedRows === 1) {
      res.status(200).json({ status: 200, message: "succesfully updated", data });
      return;
    } else {
      res.status(500).json({ status: 400, message: "bad request" , messageFa: "فرمان اشتباه" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message, messageFa: err.message });
  }
};
