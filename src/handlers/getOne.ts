import { connectToDB } from "../db/dbConnector";
import schema from "../db/schema.json";
import pkprefix from '../db/pkprefix.json';
import { getColumnNamesOf, getColumnsOf } from "./customeHandlers/showSchema";

//📄
//user getOne handler -------------------------------------------------------------------------
export const getOneUser = async (req, res) => {
  const { username } = req.params;
  const userColumns: any = Object.keys(await getColumnsOf("user"));
  const allColumnsExceptPassword = userColumns.filter((column) => !column.includes("password"));
  const sql = `SELECT ${allColumnsExceptPassword} FROM user WHERE user.username = '${username}'`;
  await getOneAndSend({ req, res, sql });
};

//profile getOne handler -------------------------------------------------------------------------
export const getOneProfile = async (req, res) => {
  const { typeOfUser, username } = req.params;

  if (!["teacher", "admin", "payer", "student"].includes(typeOfUser)) {
    res.status(404).json({
      status: 404,
      message: "Page Not Found",
    });
    return;
  }

  const sql = `SELECT * FROM ${typeOfUser} INNER JOIN userView ON ${typeOfUser}.userId = userView.userId WHERE userView.username = '${username}'`;
  await getOneAndSend({ sql, req, res });
};
//entity getOne handler -------------------------------------------------------------------------
export const getOneEntitiy = async (req, res) => {
  const { table , id } = req.params;
  if (!Object.keys(schema).includes(table) || table === "user") {
    res.status(404).json({
      status: 404,
      message: "Page Not Found",
      messageFa:"چیزی پیدا نشد!"
    });
    return;
  }
  const sql = `SELECT * FROM ${table} WHERE ${table}Id = '${id}'`;
  await getOneAndSend({ req, res, sql });
};

export const getJOneTeacherApplication = async (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM teacherApplication LEFT JOIN userView ON userView.userId = teacherApplication.applicantUserId WHERE teacherApplication.teacherApplicationId = '${id}'`;

  //getting results and nesting them!

  let teacherApplicationColumns = await getColumnNamesOf("teacherApplication");
  teacherApplicationColumns = teacherApplicationColumns.map((col) => "teacherApplication_" + col);
  let userColumns = await getColumnNamesOf("userView");
  userColumns = userColumns.map((col) => "user_" + col);
  let allColumns = teacherApplicationColumns.concat(userColumns);

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
        applicantUser: {},
      };
      Object.keys(flatResult).map((key) => {
        const [table, column] = key.split("_");
        if (table === "teacherApplication") {
          nestedResult[column] = flatResult[key];
        } else {
          nestedResult["applicantUser"][column] = flatResult[key];
        }
      });
      return nestedResult;
    });

    res.status(200).json({ status: 200, message: "success", data: nestedResults[0] });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.messageو , messageFa: err.meesage });
  }
};

// utility function
export const getOneAndSend = async ({ req, res, sql }) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);

    if (rows.length === 0) {
      res.status(400).json({ status: 400, message: "bad request" , messageFa:"فرمان اشتباه"});
      return;
    }
    res.status(200).json({ status: 200, message: "success", data: rows[0] });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.messageو , messageFa: err.meesage });
  }
};
