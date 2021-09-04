import { connectToDB } from "../db/dbConnector";
import schema from "../db/schema.json";
import { getColumnNamesOf, getColumnsOf } from "./customeHandlers/showSchema";

//📄📄📄
//users getAll handler -------------------------------------------------------------------------
export const getUsers = async (req, res) => {
  const usersColumns: string[] = Object.keys(await getColumnsOf("users"));
  const allColumnsExceptPassword = usersColumns.filter((column) => !column.includes("password"));
  const initialSql = `SELECT ${allColumnsExceptPassword} FROM users`;

  const [sql, errorMessage] = addSqlConditions(initialSql, 'users', req.query); 
  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }
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

  const sql = `SELECT * FROM ${typeOfUsers} INNER JOIN usersView ON ${typeOfUsers}.userId = usersView.userId`;
  await getAllAndSend({ sql, req, res });
};

//entities getAll handler ------------------------------------------------------------------------------
export const getEntities = async (req, res) => {
  const { entities } = req.params;
  if (!Object.keys(schema).includes(entities) || entities === "users") {
    //dont send user through this.
    res.status(404).json({
      status: 404,
      message: "No table with this name.",
    });
    return;
  }

  let initialSql = `SELECT * FROM ${entities}`;

  const [sql, errorMessage] = addSqlConditions(initialSql, entities, req.query);
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
    sql = `SELECT * FROM teacherApplications LEFT JOIN usersView ON usersView.userId = teacherApplications.applicantUserId WHERE teacherApplications.applicantUserId = '${applicantUserId}'`;
  } else {
    sql = `SELECT * FROM teacherApplications LEFT JOIN usersView ON usersView.userId = teacherApplications.applicantUserId`;
  }

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
        applicantUser: {},
      };
      Object.keys(flatResult).map((key) => {
        const [table, column] = key.split("_");
        if (table === "teacherApplications") {
          nestedResult[column] = flatResult[key];
        } else {
          nestedResult["applicantUser"][column] = flatResult[key];
        }
      });
      return nestedResult;
    });

    res.status(200).json({ status: 200, message: "success", data: nestedResults });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
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

const addSqlConditions = (sql, entities, reqQuery) => {
  


  //adding query conditons if there is any eligible query condition
  if (reqQuery) {
    //chcek if the query string is all eligible, otherwise return 400.
    const queryKeys = Object.keys(reqQuery);
    const isQueryEligible = queryKeys.every((queryKey) => {
      const columnNamesArray = Object.keys(schema[entities]);
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
