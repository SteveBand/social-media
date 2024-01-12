const { JWT_SECRET } = require("../config");

const jwt = require("jsonwebtoken");

function catchCookies(req, res, next) {
  const token = req.cookies.access_token;
  if (token) {
    const verify = jwt.verify(token, JWT_SECRET, function (err, decode) {
      if (err) {
        console.log("Verification error: " + err.name);
      } else {
        req.userData = decode;
        req.access_token = req.cookies.access_token;
      }
    });
  }

  next();
}

exports.catchCookies = catchCookies;
