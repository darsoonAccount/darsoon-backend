import { connectToDB } from "../db/dbConnector";
import schema from "../db/schema.json";
import { getColumnNamesOf, getColumnsOf } from "./customeHandlers/showSchema";

//📄📄📄
//user getAll handler -------------------------------------------------------------------------
export const getUsers = async (req, res) => {
  const userColumns: string[] = Object.keys(await getColumnsOf("user"));
  const allColumnsExceptPassword = userColumns.filter((column) => !column.includes("password"));
  const initialSql = `SELECT ${allColumnsExceptPassword} FROM user`;

  const [sql, errorMessage] = addSqlConditions(initialSql, "user", req.query);
  if (errorMessage) {
    res.status(400).json({ message: errorMessage, messageFa: errorMessage });
    return;
  }
  await getAllAndSend({ sql, req, res });
};

//profiles getAll handler -------------------------------------------------------------------------------
export const getProfiles = async (req, res) => {
  const { typeOfUser } = req.params;
  if (!["teacher", "admin", "payer", "student"].includes(typeOfUser)) {
    res.status(404).json({
      status: 404,
      message: "Not Found",
      messageFa:"چیزی پیدا نشد!"
      
    });
    return;
  }

  const sql = `SELECT * FROM ${typeOfUser} INNER JOIN userView ON ${typeOfUser}.userId = userView.userId`;
  await getAllAndSend({ sql, req, res });
};

//entity getAll handler ------------------------------------------------------------------------------
export const getEntities = async (req, res) => {
  const { table } = req.params;
  if (!Object.keys(schema).includes(table) || table === "user") {
    //dont send user through this.
    res.status(404).json({
      status: 404,
      message: "No table with this name.",
    });
    return;
  }

  let initialSql = `SELECT * FROM ${table}`;

  const [sql, errorMessage] = addSqlConditions(initialSql, table, req.query);
  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  await getAllAndSend({ sql, req, res });
};

//teacherApplications joining getAll handler ------------------------------------------------------------
export const getJTeacherApplications = async (req, res) => {
  const applicantUserId = req.query.applicantUserId;
  let sql = "";
  if (req.query.applicantUserId) {
    sql = `SELECT * FROM teacherApplication LEFT JOIN userView ON userView.userId = teacherApplication.applicantUserId WHERE teacherApplication.applicantUserId = '${applicantUserId}'`;
  } else {
    sql = `SELECT * FROM teacherApplication LEFT JOIN userView ON userView.userId = teacherApplication.applicantUserId`;
  }

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

    res.status(200).json({ status: 200, message: "success", data: nestedResults });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message , messageFa: err.meesage });
  }
};

//utility fonction
const getAllAndSend = async ({ req, res, sql }) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);
    res.status(200).json({ status: 200, message: "success", data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message , messageFa: err.meesage });
  }
};

export const getByQuery = async ({ req, res }) => {
  const { sql } = req.query;
};

const justGetAllAsAaray = async ({ req, res, sql }) => {
  // const con = await connectToDB();
  // try {
  //   const [rows, fields] = await con.array({sql, rowsAsArray: true});
  //   return rows;
  // } catch (err) {
  //   return null;
  // }
};

const addSqlConditions = (sql, table, reqQuery) => {
  //adding query conditons if there is any eligible query condition
  if (reqQuery) {
    //chcek if the query string is all eligible, otherwise return 400.
    const queryKeys = Object.keys(reqQuery);
    const isQueryEligible = queryKeys.every((queryKey) => {
      const columnNamesArray = Object.keys(schema[table]);
      return columnNamesArray.includes(queryKey);
    });
    if (!isQueryEligible) {
      return [null, "bad query string"];
    } else {
      let sqlWhereCondition = " WHERE ";
      queryKeys.forEach((queryKey) => {
        sqlWhereCondition = sqlWhereCondition + `${queryKey}='${reqQuery[queryKey]}' AND `;
      });
      sqlWhereCondition = sqlWhereCondition.slice(0, -4); //remove the last "AND ".
      sql = sql + sqlWhereCondition;
    }
  }

  return [sql, null];
};
