const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

export const initPassport = (passport, getUserByEmail) => {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await getUserByEmail(email);
      if (user === null) {
        return done(null, false, {
          message: "There is no user with this email.",
        });
      }
      const hashed = await bcrypt(user.password, 10);
      //secend part of if condtion (after ||) should be removed
      if (
        (await bcrypt.compare(password, user.password)) ||
        (await bcrypt.compare(password, hashed))
      ) {
        return done(null, user, { message: "success" });
      } else {
        return done(null, false, { message: "Password is not correct." });
      }
    } catch (error) {
      done(error, null);
    }
  };
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordFiled: "password" },
      authenticateUser
    )
  );
};
