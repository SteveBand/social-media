const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { CommunityMember, UserModel } = require("../models/models");
const mongoose = require("mongoose");

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

    const user = await UserModel.findOne({ email: data.email });

    const follow = await CommunityMember.findOne({
      parentId: user._id,
      communityId: req.params.id,
    });

    if (!follow) {
      return res
        .status(401)
        .send({ message: "User is not member of this community" });
    }

    next();
  } catch (err) {
    console.log("An error has occured at communityGuard.js ", err);
  }
}

exports.communityGuard = communityGuard;
