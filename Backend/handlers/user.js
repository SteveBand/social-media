const {
  getUserFollowingLogged,
  getUserFollowersLogged,
} = require("../lib/aggregations/user/logged");
const {
  getUserFollowingUnlogged,
  getUserFollowersUnLogged,
} = require("../lib/aggregations/user/unLogged");
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

module.exports = (app) => {
  app.get("/profile/:userId", async (req, res) => {
    const userId = req.params.userId;
    console.log(req.cookies);
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
    return res.send(postArr).status(200);
  });

  app.get("/:user/likes", catchCookies, async (req, res) => {
    const userId = req.params.user;
    const loggedUserId = req?.userData?.email || "";
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

  app.get("/:user/followers", catchCookies, async (req, res) => {
    const userId = req.params.user;
    const loggedUserId = req.userData?.email || "";

    if (!userId) {
      return res.send({ message: "User not Found!" });
    }

    try {
      if (loggedUserId !== "") {
        const obj = await FollowersModel.aggregate(
          getUserFollowersLogged(userId, loggedUserId)
        );
        return res.status(200).send(obj);
      } else {
        const obj = await FollowersModel.aggregate(
          getUserFollowersUnLogged(userId)
        );
        return res.send(obj).status(200);
      }
    } catch (err) {
      console.log("An error occured at /:user/followers", err.name);
      return res.send({ message: "An error has Occured" }).status(400);
    }
  });

  app.get("/:user/following", catchCookies, async (req, res) => {
    const userId = req.params.user;
    const loggedUserId = req.userData?.email || "";
    if (!userId) {
      return res.send({ message: "User not found!" });
    }
    try {
      if (loggedUserId !== "") {
        const obj = await FollowersModel.aggregate(
          getUserFollowingLogged(userId, loggedUserId)
        );
        return res.status(200).send(obj);
      } else {
        const obj = await FollowersModel.aggregate(
          getUserFollowingUnlogged(userId)
        );
        return res.status(200).send(obj);
      }
    } catch (err) {
      console.log("An error has occured at /:user/followes", err);
      return res.send({ message: "something went wrong" });
    }
  });
};
