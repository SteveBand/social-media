const { authGuard } = require("../middlewares/authGuard");
const { FollowersModel, UserModel } = require("../models/models");
module.exports = (app) => {
  app.post("/new/follow", authGuard, async (req, res) => {
    const parentId = req.query.parentId;
    const follows = req.query.follows;
    try {
      const existingFollow = await FollowersModel.findOne({
        parentId,
        follows,
      });
      if (existingFollow) {
        console.log("Follow exists");
        return res
          .send({ message: "Already following this User!" })
          .status(400);
      }
      const newFollow = await new FollowersModel({
        parentId: parentId,
        follows: follows,
      }).save();

      await UserModel.findOneAndUpdate(
        { email: parentId },
        { $inc: { following: 1 } }
      );

      await UserModel.findOneAndUpdate(
        {
          email: follows,
        },
        { $inc: { followers: 1 } }
      );

      return res.send(newFollow).status(200);
    } catch (err) {
      console.log("An error has occured at /new/follow", err);
      return res.send({ message: "An error has occured" }).status(500);
    }
  });

  app.post("/delete/follow", authGuard, async (req, res) => {
    const parentId = req.query.parentId;
    const follows = req.query.follows;
    try {
      await FollowersModel.deleteOne({ parentId, follows });
      await UserModel.findOneAndUpdate(
        { email: parentId },
        { $inc: { following: -1 } }
      );

      await UserModel.findOneAndUpdate(
        {
          email: follows,
        },
        { $inc: { followers: -1 } }
      );

      return res.send().status(200);
    } catch (err) {
      console.log("An error has occured at '/delete/follow':  ", err);
      return res
        .send({
          message: "An error has Occured please try again later",
        })
        .status(500);
    }
  });
};
