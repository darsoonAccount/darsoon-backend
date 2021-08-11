const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const fs = require("fs");
const path = require("path");
require("dotenv").config();
// const User = require('mongoose').model('User');

import { getUserById } from "../handlers/customeHandlers/getUserBy";

const pathToKey = path.join(__dirname, "..", "/passport/id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

// The JWT payload is passed into the verify callback
export const jwtStrategy = new JwtStrategy(
  options,
  async (jwt_payload, done) => {
    console.log("JWT PayLoad", jwt_payload);
    const userId = jwt_payload.sub;
    // We will assign the `sub` property on the JWT to the database ID of user
    try {
      const user = await getUserById(userId);
      if (user) {
        return done(null, user); //success
      } else {
        return done(null, false); //not verified
      }
    } catch (error) {
      done(error, null); //exeption happend
    }
  }
);
