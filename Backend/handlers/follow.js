const { authGuard } = require("../middlewares/authGuard");
const { FollowersModel, UserModel } = require("../models/models");
const mongoose = require("mongoose");
module.exports = (app) => {
  app.post("/new/follow", authGuard, async (req, res) => {
    const parentId = new mongoose.Types.ObjectId(req.query.parentId);
    const follows = new mongoose.Types.ObjectId(req.query.follows);

    try {
      const existingFollow = await FollowersModel.findOne({
        parentId,
        follows,
      });

      if (existingFollow) {
        return res
          .status(400)
          .send({ message: "Already following this User!" });
      }

      const newFollow = await new FollowersModel({
        parentId: parentId,
        follows: follows,
      }).save();

      await UserModel.findOneAndUpdate(
        { _id: parentId },
        { $inc: { following: 1 } }
      );

      await UserModel.findOneAndUpdate(
        {
          _id: follows,
        },
        { $inc: { followers: 1 } }
      );

      return res.status(200).send(newFollow);
    } catch (err) {
      console.log("An error has occured at /new/follow", err);
      return res.send({ message: "An error has occured" }).status(500);
    }
  });

  app.post("/delete/follow", authGuard, async (req, res) => {
    const parentId = new mongoose.Types.ObjectId(req.query.parentId);
    const follows = new mongoose.Types.ObjectId(req.query.follows);

    try {
      await FollowersModel.deleteOne({ parentId, follows });
      await UserModel.findOneAndUpdate(
        { _id: parentId },
        { $inc: { following: -1 } }
      );

      await UserModel.findOneAndUpdate(
        {
          _id: follows,
        },
        { $inc: { followers: -1 } }
      );

      return res.status(200).send({ message: "Success" });
    } catch (err) {
      console.log("An error has occured at '/delete/follow':  ", err);
      return res.status(500).send({
        message: "An error has Occured please try again later",
      });
    }
  });
};
