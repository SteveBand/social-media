const { catchCookies } = require("../middlewares/catchCookies");
const {
  UserModel,
  FollowersModel,
  Post,
  LikesModel,
  CommentModel,
} = require("../models/models");

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

  app.get("/:user/posts", catchCookies, (req, res) => {
    const userId = req.params.user;
  });
};
