import { connectToDB } from "../db/dbConnector";
import schema from "../db/schema.json";
import pkprefix from '../db/pkprefix.json';

//🚮
//typeOfUser delete handler -------------------------------------------------------------------------
export const deleteUser = async (req, res) => {
  const { username } = req.params;
  const sql = `DELETE FROM user WHERE user.username = '${username}'`;
  await deleteOneAndSend({ req, res, sql });
};

//profile delete handler -------------------------------------------------------------------------
export const deleteProfile = async (req, res) => {
  const { typeOfUser, username } = req.params;
  if (!["teacher", "admin", "payer", "student"].includes(typeOfUser)) {
    res.status(404).json({
      status: 404,
      message: "Page Not Found",
    });
    return;
  }

  const sql = `DELETE ${typeOfUser}.* FROM ${typeOfUser} INNER JOIN user ON ${typeOfUser}.userId = user.userId WHERE user.username = '${username}'`;
  await deleteOneAndSend({ sql, req, res });
};

//entity delete handler -------------------------------------------------------------------------
export const deleteEntitiy = async (req, res) => {
  const { table, id } = req.params;
  if (!Object.keys(schema).includes(table)) {
    res.status(404).json({
      status: 404,
      message: "Page Not Found!",
    });
    return;
  }
  const sql = `DELETE FROM ${table} WHERE ${table}Id = '${id}'`;
  await deleteOneAndSend({ req, res, sql });
};

//utility function
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
