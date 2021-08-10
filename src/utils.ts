import { connectToDB } from "./db/dbConnector";

export const genPK = (str: string): string => {
  const d = new Date("January 01, 2020 00:00:00 GMT+00:00");
  const now = new Date();
  const milisecs = now.getTime() - d.getTime();
  return `${str}-${milisecs}`;
};

export const findUserId = async (username) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(
      `SELECT * FROM users WHERE users.username = '${username}'`
    );
    console.log(rows);
    if (rows.length === 0) {
      return null;
    }
    return rows[0].userId;
  } catch (error) {
    return null;
  }
};

export const findPk = async ({ username, table, entity }) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(
      `SELECT * FROM ${table} INNER JOIN users ON ${table}.userId = users.userId WHERE users.username = '${username}'`
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0][`${entity}Id`];
  } catch (error) {
    return null;
  }
};

// export const isDuplicate = async ({ sql }) => {
//   const con = await connectToDB();
//   try {
//     const [rows, fields] = await con.execute(sql);
//     if (rows.length === 1) {
//       return [null, true];
//     } else {
//       return [null, false];
//     }
//   } catch (error) {
//     return [error, null];
//   }
// };
