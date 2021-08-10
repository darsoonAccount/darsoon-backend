import { connectToDB } from "../db/dbConnector";
import schema from "../db/schema.json";
import { getColumnsOf } from "./customeHandlers/showSchema";

//📄📄📄
//users getAll handler -------------------------------------------------------------------------
export const getUsers = async (req, res) => {
  const usersColumns: string[] = Object.keys(await getColumnsOf("users"));
  const allColumnsExceptPassword = usersColumns.filter(
    (column) => !column.includes("password")
  );
  const sql = `SELECT ${allColumnsExceptPassword} FROM users`;
  await getAllAndSend({ sql, req, res });
};

//profiles getAll handler -------------------------------------------------------------------------------
export const getProfiles = async (req, res) => {
  const { typeOfUsers } = req.params;
  if (!["teachers", "admins", "payers", "students"].includes(typeOfUsers)) {
    res.status(404).json({
      status: 404,
      message: "Page Not Found",
    });
    return;
  }

  const sql = `SELECT * FROM ${typeOfUsers} INNER JOIN users ON ${typeOfUsers}.userId = users.userId`;
  await getAllAndSend({ sql, req, res });
};

//entities getAll handler ------------------------------------------------------------------------------
export const getEntities = async (req, res) => {
  const { entities } = req.params;
  if (!Object.keys(schema).includes(entities) || entities === "users") {
    res.status(404).json({
      status: 404,
      message: "Page Not Found",
    });
    return;
  }
  const sql = `SELECT * FROM ${entities}`;
  await getAllAndSend({ sql, req, res });
};

//utility fonction
const getAllAndSend = async ({ req, res, sql }) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);
    res.status(200).json({ status: 200, message: "success", data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};
