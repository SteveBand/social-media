const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { CommunityMember } = require("../models/models");

async function communityGuard(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.send({ message: "Unauthorized" }).status(401);
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    if (!data) {
      return res.send({ message: "Invalid Token" }).status(401);
    }
    req.userData = data;
    const follow = await CommunityMember.findOne({
      parentId: req.userData.email,
      communityId: req.params.id,
    });
    if (!follow) {
      return res
        .send({ message: "User is not member of this community" })
        .status(403);
    }
    next();
  } catch (err) {
    console.log("An error has occured at communityGuard.js ", err.name);
  }
}

exports.communityGuard = communityGuard;
