const {
  userPostsAggregation,
  userAllLiked,
  userCommentLikes,
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
    try {
      const obj = await LikesModel.aggregate(
        userAllLiked(userId, loggedUserId)
      );
      return res.send(obj);
    } catch (err) {
      console.log("An error occured at /:user/likes ", err.name);
      return res.send({ message: "An error has occured try again later" });
    }
  });

  app.get("/:user/comments", catchCookies, async (req, res) => {
    const userId = req.params.user;
    const loggedUserId = req.userData.email;
    if (!userId) {
      return res.send({ message: "User not found!" }).status(404);
    }
    try {
      const obj = await CommentModel.aggregate(
        userCommentLikes(userId, loggedUserId)
      );
      console.log(obj);
      return res.send(obj);
    } catch (err) {
      console.log("An error occured at /:user/comments", err);
      return res.send({ message: "An error has occured try again later" });
    }
  });
};
