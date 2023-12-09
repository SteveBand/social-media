const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function authGuard(req, res, next) {
  const token = req.headers.authorization.split("Bearer ")[1];
  const verify = jwt.verify(token, JWT_SECRET, (err, data) => {
    if (err) {
      res.status(401).send("User is not authorized");
    } else {
      next();
    }
  });
}

exports.authGuard = authGuard;
