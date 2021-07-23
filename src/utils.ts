import { connectToDB } from "./dbConnector";
import validator , {isEmail, isAlpha} from 'validator';

export const genPK = (str: string): string => {
  const d = new Date("January 01, 2020 00:00:00 GMT+00:00");
  const now = new Date();
  const milisecs = now.getTime() - d.getTime();
  return `${str}-${milisecs}`;
};

export const isDataValid = (dataPatternArray) => {
const isVaid = ({data, dataType , isOptional}) => {
  if(!isOptional && (data === undefined || data === null || data.length === 0) ) {
    return false;
  }
  // to be complated
  switch (dataType) {
    case('email'):
    return isEmail(data);
    case('alpha'):
    return isAlpha(data);
    default:
      return false;
  }

}

  dataPatternArray.every(item => {
    return isValid(item);
  })
}

//not neccessary
// export const findUserId = async ({ req, res,  username }) => {
//   const con = await connectToDB();
//   try {
//     const [rows, fields] = await con.execute(
//       `SELECT * FROM users WHERE users.username = '${username}'`
//     );

//     if (rows.length === 0) {
//       return null;
//     }
//     return rows[0].userId;
//   } catch (error) {
//     res.status(500).json({status: 500 , message:error.message});
//   }
// };

export const getAllAndSend = async ({ req, res, sql }) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);
    res.status(200).json({ status: 200, message: "success", data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

export const getOneAndSend = async ({ req, res, sql }) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(sql);
    if (rows.length === 0) {
      res.status(400).json({ status: 400, message: "bad request" });
      return;
    }
    res.status(200).json({ status: 200, message: "success", data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};


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

export const addOneAndSend = async ({req, res , sql}) => {
  try {

  }
}