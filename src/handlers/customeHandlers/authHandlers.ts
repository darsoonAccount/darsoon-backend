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
    res.status(400).json({ status: 400, message: "Wrong email or password.", messageFa: "ایمیل یا گذرواژه را اشتباه وارد کرد‌اید." });
  } else {
    const hashedPasswordInDB = await getPassword(user.userId);
    if (!(await bcrypt.compare(password, hashedPasswordInDB))) {
      res.status(400).json({ status: 400, message: "Wrong email or password.", messageFa: "ایمیل یا گذرواژه را اشتباه وارد کرد‌اید." });
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
  const tableSchema = schema.user;

  const table = "user";
  const PKprefix = "usr";

  const [isDataValid, validationMessage] = isValid({
    data,
    tableSchema,
    isUpdating: false,
  });
  if (!isDataValid) {
    res.status(400).json({ status: 400, message: validationMessage , messageFa: validationMessage });
    return;
  }
  const pk = genPK(PKprefix);
  const keys = Object.keys(data).filter((key) => data[key] !== null);
  const values = Object.values(data)
    .filter((value) => value !== null)
    .map((value) => `'${value}'`);
  const sql = `INSERT INTO ${table} (${table}Id ,${keys}) VALUES ('${pk}', ${values})`;

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
    if (err.message.toLowerCase().includes("dup")) {
      if (err.message.includes("email")) {
        res.status(400).json({
          status: 400,
          message: "This email is used before. USe another email. If this email is yours, try logging into you account. If you have forgotten your password, click on 'Forget Password'.",
          messageFa: "حساب دیگری با این ایمیل ثبت شده است. لطفا از ایمیل دیگری استفاده نمایید. اگر این ایمیل متغل به شماست از طریق «ورود به حساب» وارد حسابتان شوید. اگر گذرواژه را فراموش کرده‌اید روی بازیابی گذرواژه کلیک کنید.",
        });
      }
      if (err.message.includes("username")) {
        res.status(400).json({ status: 400, message: "This is username is already tanken. try another username.", messageFa: "حساب دیگری از این نام کاربری استفاده کرده‌است. لطفا نام کاربری دیگری انتخاب کنید." });
      }
      res.status(400).json({ status: 400, message: err.message, messageFa: err.meesage });
      return;
    } else {
      res.status(500).json({ status: 500, message: err.message, messageFa: err.meesage });
      return;
    }
  }
};
