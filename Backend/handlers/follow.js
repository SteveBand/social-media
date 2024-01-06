const { authGuard } = require("../middlewares/authGuard");
const { FollowersModel } = require("../models/models");
module.exports = (app) => {
  app.post("/new/follow", authGuard, async (req, res) => {
    const parentId = req.query.parentId;
    const follows = req.query.follows;
    const existingFollow = await FollowersModel.findOne({ parentId, follows });
    if (existingFollow) {
      console.log("Follow exists");
      return res.send({ message: "Already following this User!" }).status(400);
    }
    const newFollow = await new FollowersModel({
      parentId: parentId,
      follows: follows,
    }).save();
    return res.send(newFollow).status(200);
  });

  app.post("/delete/follow", authGuard, async (req, res) => {
    const parentId = req.query.parentId;
    const follows = req.query.follows;
    try {
      await FollowersModel.deleteOne({ parentId, follows });
      return res.status(200);
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
