/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */

const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "..", "/passport/id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

export const issueJWT = (userId) => {
  const expiresIn = "1d";

  const payload = {
    sub: userId,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expiresIn: expiresIn,
  };
};
