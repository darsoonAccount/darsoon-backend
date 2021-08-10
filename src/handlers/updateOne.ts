import { connectToDB } from "../db/dbConnector";
import { isValid } from "../validator";
import { genPK, findUserId, findPk } from "../utils";
import schema from "../db/schema.json";
import tables from "../db/tables.json";
import bcrypt from "bcrypt";

// 📝
//users  update handler -------------------------------------------------------------------------
export const updateUser = async (req, res) => {
  const { username } = req.params;
  let data = req.body;
  const { password } = req.body;
  if (password) {
    const hashedPassword = await bcrypt(password, 10);
    data = { ...req.body, password: hashedPassword };
  }
  const tableSchema = schema.users;
  const entity = tables.users.entity;

  const pk = await findUserId(username);
  if (pk === null) {
    res
      .status(400)
      .json({ status: 400, message: "There is no user with this username." });
    return;
  }

  await ValidateUpdateAndSend({
    req,
    res,
    entity: tables.users.entity,
    table: "users",
    pkprefix: tables.users.pkprefix,
    pk,
    data,
    tableSchema,
  });
};

//profiles update handler -------------------------------------------------------------------------
export const updateProfile = async (req, res) => {
  const { username, typeOfUsers } = req.params;
  const data = req.body;
  const tableSchema = schema[typeOfUsers];
  const entity = tables[typeOfUsers].entity;

  const pk = await findPk({ username, table: typeOfUsers, entity });
  if (pk === null) {
    res
      .status(400)
      .json({ status: 400, message: "There is no user with this username." });
    return;
  }

  await ValidateUpdateAndSend({
    req,
    res,
    entity,
    table: typeOfUsers,
    pkprefix: tables[typeOfUsers].pkprefix,
    pk,
    data,
    tableSchema,
  });
};

//entities update handler -------------------------------------------------------------------------
export const updateEntity = async (req, res) => {
  const { id, entities } = req.params;
  let data = req.body;
  const { password } = req.body;
  if (password) {
    const hashedPassword = await bcrypt(password, 10);
    data = { ...req.body, password: hashedPassword };
  }
  const tableSchema = schema[entities];

  await ValidateUpdateAndSend({
    req,
    res,
    entity: tables[entities].entity,
    table: entities,
    pkprefix: tables[entities].pkprefix,
    pk: id,
    data,
    tableSchema,
  });
};

// utility functions -------------------------------------------------------------------------
const ValidateUpdateAndSend = async ({
  req,
  res,
  entity,
  table,
  pkprefix,
  pk,
  data,
  tableSchema,
}) => {
  const [isDataValid, validationMessage] = isValid({
    data,
    tableSchema,
    isUpdating: false,
  });
  if (!isDataValid) {
    res.status(400).json({ status: 400, message: validationMessage });
    return;
  }
  let setAssignements = Object.keys(data).map((key) => {
    if (data[key] === null) {
      return `${key} = NULL`;
    }
    return `${key} = '${data[key]}'`;
  });
  const sql = `UPDATE ${table} SET ${setAssignements} WHERE  ${entity}Id = '${pk}'`;
  await updateOneAndSend({ req, res, sql });
};

const updateOneAndSend = async ({ req, res, sql }) => {
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
