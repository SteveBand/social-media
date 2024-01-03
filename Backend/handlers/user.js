const {
  userPostsAggregation,
  userAllLiked,
} = require("../lib/aggregations/userAgg");
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
    const user = await UserModel.findOne({ email: userId });
    if (!user) {
      return res.send({ message: "User not Found" }).status(404);
    } else {
      return res.send(user).status(200);
    }
  });

  app.get("/:user/posts", catchCookies, async (req, res) => {
    const userId = req.params.user;
    if (!userId) {
      return res.send({ message: "User not Found!" }).status(404);
    }

    const postArr = await Post.aggregate(userPostsAggregation(userId));
    console.log(postArr);
    return res.send(postArr).status(200);
  });

  app.get("/:user/likes", catchCookies, async (req, res) => {
    const userId = req.params.user;
    const loggedUserId = req.userData.email;
    if (!userId) {
      return res.send({ message: "User not Found!" }).status(404);
    }
    const obj = await LikesModel.aggregate(userAllLiked(userId, loggedUserId));
    console.log(obj);
    return res.send(obj);
  });
};
