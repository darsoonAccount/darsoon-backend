import { connectToDB } from "../dbConnector";
import schema from "../schema.json";
import tables from "../tables.json";

//🚮
//users delete handler -------------------------------------------------------------------------
export const deleteUser = async (req, res) => {
  const { username } = req.params;
  const sql = `DELETE FROM users WHERE users.username = '${username}'`;
  await deleteOneAndSend({ req, res, sql });
};

//profile delete handler -------------------------------------------------------------------------
export const deleteProfile = async (req, res) => {
  const { typeOfUsers, username } = req.params;
  if (!["teachers", "admins", "payers", "students"].includes(typeOfUsers)) {
    res.status(404).json({
      status: 404,
      message: "Page Not Found",
    });
    return;
  }

  const sql = `DELETE ${typeOfUsers}.* FROM ${typeOfUsers} INNER JOIN users ON ${typeOfUsers}.userId = users.userId WHERE users.username = '${username}'`;
  await deleteOneAndSend({ sql, req, res });
};

//entities delete handler -------------------------------------------------------------------------
export const deleteEntitiy = async (req, res) => {
  const { entities, id } = req.params;
  if (!Object.keys(schema).includes(entities)) {
    res.status(404).json({
      status: 404,
      message: "Page Not Found!",
    });
    return;
  }
  const entity = tables[entities].entity;
  const sql = `DELETE FROM ${entities} WHERE ${entity}Id = '${id}'`;
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

