const mongoose = require("mongoose");
const { authGuard } = require("../middlewares/authGuard");
const { LikesModel } = require("../models/models");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
module.exports = (app) => {
  app.post("/new/like", authGuard, async (req, res) => {
    const { parentId } = req.body;
    const userData = req.userData;
    const likeBody = { parentId, userId: userData.email };
    const existingLike = await LikesModel.findOne(likeBody);
    if (existingLike) {
      return res.send({ message: "Already Liked" }).status(400);
    }
    await new LikesModel(likeBody).save();

    res.send({ message: "Success" }).status(200);
  });

  app.post("/delete/like", authGuard, async (req, res) => {
    const token = req.cookies.access_token;
    const userData = jwt.verify(token, JWT_SECRET);
    if (!userData) return;
    await LikesModel.deleteOne({
      parentId: req.body.parentId,
      userId: userData.email,
    });
    res.send({ message: "Success" }).status(200);
  });
};
