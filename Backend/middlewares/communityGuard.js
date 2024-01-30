const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { CommunityMember, UserModel } = require("../models/models");
const mongoose = require("mongoose");

async function communityGuard(req, res, next) {
  const user = req.user || null;

  try {
    if (!user) {
      return res.status(401).send({ message: "Unauthorised" });
    }

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
