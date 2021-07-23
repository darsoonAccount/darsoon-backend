import { connectToDB, findInDB, insertInDB, deleteInDB } from "../dbConnector";
import { genPK } from "../utils";

// Teachers handlers 👩‍🏫👨‍🏫  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

//📄📄📄
export const getTeachers = async (req, res) => {
  const con = await connectToDB();
  try {
    const [rows, fields] = await con.execute(
      `SELECT * FROM teachers INNER JOIN users ON teachers.userId = users.userId`
    );
    res.status(200).json({ status: 200, message: "success", data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

export const getOneTeacher = async (req, res) => {
  const { username } = req.params;

  const [err, data] = await findInDB({
    sql: `SELECT * FROM teachers INNER JOIN users ON teachers.userId=users.userId WHERE username = '${username}'`,
  });
  if (err) {
    res.status(500).json({ status: 500, messeage: err.message });
    return;
  }
  if (!data || data.length === 0) {
    res
      .status(400)
      .json({ status: 400, message: "No teacher with this username" });
    return;
  }
  res.status(200).json({ status: 200, message: "Ok", data: data[0] });
  return;
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
  const con = await connectToDB();
  try {
    await con.beginTransaction();

    const [userRows, userFields] = await con.execute(
      `SELECT users WHERE users.username = '${username}`
    );
    const userId = userRows[0].userId;
    const [deleteResult, deleteFields] = await con.execute(
      `DELETE teachers WHERE teachers.userId = '${userId}`
    );
    await con.commit();
    if (deleteResult.affectedRows === 0) {
      res.json({ status: 400, message: "No teacher with this username" });
      return;
    } else {
      res.status(200).json({ status: 200, message: "Teacher deleted" });
      return;
    }
  } catch (error) {
    con.rollback();
    console.log(error);
    res.status(500).json({ status: 500, messeage: error.message });
  } 
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
