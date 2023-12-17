const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function authGuard(req, res, next) {
  const token = req.cookies.access_token;
  const verify = jwt.verify(token, JWT_SECRET, (err, data) => {
    if (err) {
      res.status(401).send("User is not authorized");
    } else {
      req.userData = data;
    }
  });
  next();
}

exports.authGuard = authGuard;
