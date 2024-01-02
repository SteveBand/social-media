const { UserModel, FollowersModel } = require("../models/models");

UserModel;

module.exports = (app) => {
  app.get("/profile/:userId", async (req, res) => {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.send({ message: "User not Found" }).status(404);
    } else {
      return res.send(user).status(200);
    }
  });
};
