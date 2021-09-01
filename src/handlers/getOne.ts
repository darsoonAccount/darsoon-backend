import { connectToDB } from "../db/dbConnector";
import schema from "../db/schema.json";
import tables from "../db/tables.json";
import { getColumnNamesOf, getColumnsOf } from "./customeHandlers/showSchema";

//📄
//users getOne handler -------------------------------------------------------------------------
export const getOneUser = async (req, res) => {
  const { username } = req.params;
  const usersColumns: any = Object.keys(await getColumnsOf("users"));
  const allColumnsExceptPassword = usersColumns.filter((column) => !column.includes("password"));
  const sql = `SELECT ${allColumnsExceptPassword} FROM users WHERE users.username = '${username}'`;
  await getOneAndSend({ req, res, sql });
};

//profile getOne handler -------------------------------------------------------------------------
export const getOneProfile = async (req, res) => {
  const { typeOfUsers, username } = req.params;

  if (!["teachers", "admins", "payers", "students"].includes(typeOfUsers)) {
    res.status(404).json({
      status: 404,
      message: "Page Not Found",
    });
    return;
  }

  const sql = `SELECT * FROM ${typeOfUsers} INNER JOIN usersView ON ${typeOfUsers}.userId = usersView.userId WHERE usersView.username = '${username}'`;
  await getOneAndSend({ sql, req, res });
};
//entities getOne handler -------------------------------------------------------------------------
export const getOneEntitiy = async (req, res) => {
  const { entities, id } = req.params;
  if (!Object.keys(schema).includes(entities) || entities === "users") {
    res.status(404).json({
      status: 404,
      message: "Page Not Found",
    });
    return;
  }
  const entity = tables[entities].entity;
  const sql = `SELECT * FROM ${entities} WHERE ${entity}Id = '${id}'`;
  await getOneAndSend({ req, res, sql });
};

export const getJOneTeacherApplication = async (req, res) => {

  const {id} = req.params;

  const sql = `SELECT * FROM teacherApplications LEFT JOIN usersView ON usersView.userId = teacherApplications.applicantUserId WHERE teacherApplications.teacherApplicationId = '${id}'`;
  

  //getting results and nesting them!

  let teacherApplicationsColumns = await getColumnNamesOf("teacherApplications");
  teacherApplicationsColumns = teacherApplicationsColumns.map((col) => "teacherApplications_" + col);
  let usersColumns = await getColumnNamesOf("usersView");
  usersColumns = usersColumns.map((col) => "users_" + col);
  let allColumns = teacherApplicationsColumns.concat(usersColumns);

  const con = await connectToDB();
  try {
    const [rows, fields] = await con.query({ sql, rowsAsArray: true });

    const results = rows.map((row) => {
      const obj = {};
      row.map((val, index) => {
        obj[allColumns[index]] = val;
      });
      return obj;
    });
    
    const nestedResults = results.map((flatResult) => {
      const nestedResult = {
        applicantUser: {}
      };
      Object.keys(flatResult).map((key) => {
        const [table, column] = key.split("_");
        if (table === 'teacherApplications') {
          nestedResult[column] = flatResult[key];
        } else {
          nestedResult['applicantUser'][column] = flatResult[key];
        }
      });
      return nestedResult;
    });

    res.status(200).json({ status: 200, message: "success", data: nestedResults[0] });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};


// utility function
export const getOneAndSend = async ({ req, res, sql }) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);

    if (rows.length === 0) {
      res.status(400).json({ status: 400, message: "bad request" });
      return;
    }
    res.status(200).json({ status: 200, message: "success", data: rows[0] });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};
