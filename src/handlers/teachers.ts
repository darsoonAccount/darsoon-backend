import { connectToDB, findInDB, insertInDB, deleteInDB } from "../dbConnector";
import {
  deleteOneAndSend,
  findUserId,
  genPK,
  getAllAndSend,
  getOneAndSend,
} from "../utils";

// Teachers handlers 👩‍🏫👨‍🏫  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

//📄📄📄
export const getTeachers = async (req, res) => {
  const sql = `SELECT * FROM teachers INNER JOIN users ON teachers.userId = users.userId`;
  await getAllAndSend({ sql, req, res });
};

export const getOneTeacher = async (req, res) => {
  const { username } = req.params;
  const sql = `SELECT * FROM teachers INNER JOIN users ON teachers.userId=users.userId WHERE username = '${username}'`;
  await getOneAndSend({ req, res, sql });
};

export const updateTeacher = async (req, res) => {
  // const { username } = req.params;
  // check if req.body is not empty
  // check if all values in req.body are not empty.
  // if (Object.keys(req.body).length === 0 || Object) {
  //   res
  //     .status(400)
  //     .json({ status: 400, message: "Please provide updated information" });
  //   return;
  // }
};

export const deleteTeacher = async (req, res) => {
  const { username } = req.params;
  const sql = `DELETE teachers.* FROM teachers INNER JOIN users ON teachers.userId = users.userId WHERE users.username = '${username}'`;
  await deleteOneAndSend({ req, res, sql });
};

export const addTeacher = async (req, res) => {
  const { username } = req.params;
  //validate data
  //   should be replaced with teacher attributes.
  //   const { firstname, lastname, password, email } = req.body;
  //   if (!username || !firstname || !lastname || !password || !email) {
  //     res
  //       .status(400)
  //       .json({ status: 400, message: "Please provide all required data." });
  //   }
  const userId = genPK("user");
  const teacherId = genPK("tch");
  //insert data
  const con = await connectToDB();
  try {
    const [rows, fields0] = await con.execute(
      `SELECT * FROM users WHERE username = '${username}'`
    );

    if (rows.length === 0) {
      res
        .status(400)
        .json({ status: 400, message: "There is no user with this username" });
      return;
    }
    const userId = rows[0].userId;
    const sql = `INSERT INTO teachers (teacherId, userId) VALUES ('${teacherId}', '${userId}')`;
    const [insertResult, fields] = await con.execute({ sql });
    res.status(200).json({ status: 200, message: "teacher added" });
    return;
  } catch (error) {
    if (error.message.includes("Dup")) {
      res.status(400).json({ status: 400, messeage: error.message });
      return;
    }
    res.status(500).json({ status: 500, messeage: error.message });
    return;
  }
};
