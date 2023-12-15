function catchCookies(req, res, next) {
  const token = req.cookies.access_token;
  if (token) {
    req.access_token = token;
    next();
  } else {
    next();
  }
}

exports.catchCookies = catchCookies;
