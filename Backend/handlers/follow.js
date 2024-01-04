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
};
