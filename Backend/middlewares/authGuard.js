const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function authGuard(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("User is not authorized - No token found!");
    return res.status(401).send({ message: "User Unauthorized" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.userData = data;
    next();
  } catch (err) {
    console.log("User is not authrozied - Token verification failed!");
    return res.status(401).send("User is not Authorized");
  }
}

exports.authGuard = authGuard;
