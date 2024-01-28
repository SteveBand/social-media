const { JWT_SECRET } = require("../config");

const jwt = require("jsonwebtoken");

function catchCookies(req, res, next) {
  const user = req.session.user || null;
  const token = user?.token || null;

  try {
    if (!user && !token) {
      next();
    }

    if (token) {
      const verify = jwt.verify(token, JWT_SECRET, function (err, decode) {
        if (err) {
          console.log("Verification error: " + err.name);
        } else {
          req.userData = decode;
        }
      });
      next();
    }
  } catch (error) {
    console.log("An error has Occured at middleware catchCookies");
    return res.status(500).send({ message: "Internal server error" });
  }
}

exports.catchCookies = catchCookies;
