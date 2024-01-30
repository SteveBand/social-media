const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function authGuard(req, res, next) {
  const user = req.user || null;
  try {
    if (!user) {
      return res.status(401).send({ message: "Unauthorised" });
    } else {
      return next();
    }
  } catch (err) {
    console.log("User is not authrozied!");
    return res.status(401).send({ message: "Unauthorised" });
  }
}

exports.authGuard = authGuard;
