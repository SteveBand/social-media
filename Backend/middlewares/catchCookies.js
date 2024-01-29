const { JWT_SECRET } = require("../config");

const jwt = require("jsonwebtoken");

function catchCookies(req, res, next) {
  const user = req.session?.user || req.session?.passport?.user;
  const token = user?.token || null;

  try {
    if (!user || !token) {
      return next();
    }

    if (token) {
      const verify = jwt.verify(token, JWT_SECRET, function (err, decode) {
        if (err) {
          console.log("Verification error: " + err.name);
        } else {
          req.userData = decode;
        }
      });
      return next();
    }
  } catch (error) {
    console.log("An error has Occured at middleware catchCookies");
    return res.status(500).send({ message: "Internal server error" });
  }
}

exports.catchCookies = catchCookies;
