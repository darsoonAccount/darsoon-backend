const bcrypt = require("bcrypt");
import { issueJWT } from "../../passport/issueJwt";
import { getPassword, getUserByEmail } from "./getUserBy";
import schema from "../../db/schema.json";
import { isValid } from "../../validator";
import { genPK } from "../../utils";
import { connectToDB } from "../../db/dbConnector";

//---------------------------------------------------------------------------------

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    res.status(400).json({ status: 400, message: "No user with this email" });
  } else {
    const hashedPasswordInDB = await getPassword(user.userId);
    if (!(await bcrypt.compare(password, hashedPasswordInDB))) {
      res.status(401).json({ status: 401, message: "wrong password" });
    } else {
      const { token, expiresIn } = issueJWT(user.userId);
      res.status(200).json({
        status: 200,
        message: "logged in successfully",
        data: {
          user,
          token,
          expiresIn,
        },
      });
    }
  }
};

//---------------------------------------------------------------------------------------

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const data = { ...req.body, password: hashedPassword };
  const tableSchema = schema.users;

  const entity = "user";
  const table = "users";
  const PKprefix = "usr";

  const [isDataValid, validationMessage] = isValid({
    data,
    tableSchema,
    isUpdating: false,
  });
  if (!isDataValid) {
    res.status(400).json({ status: 400, message: validationMessage });
    return;
  }
  const pk = genPK(PKprefix);
  const keys = Object.keys(data).filter((key) => data[key] !== null);
  const values = Object.values(data)
    .filter((value) => value !== null)
    .map((value) => `'${value}'`);
  const sql = `INSERT INTO ${table} (${entity}Id ,${keys}) VALUES ('${pk}', ${values})`;

  const con = await connectToDB();
  try {
    const [insertResult, fields] = await con.execute(sql);
    if (insertResult.affectedRows === 1) {
      const { token, expiresIn } = issueJWT(pk);
      const user = await getUserByEmail(email);
      res.status(200).json({
        status: 200,
        message: "succefully added",
        data: { user, token, expiresIn },
      });
      return;
    }
  } catch (err) {
    if (err.message.includes("Dup")) {
      res.status(400).json({ status: 400, message: err.message });
      return;
    } else {
      res.status(500).json({ status: 500, message: err.message });
      return;
    }
  }
};
