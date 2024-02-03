const {
  getUserFollowingLogged,
  getUserFollowersLogged,
  userAllLikedLogged,
  userCommentsLogged,
  userPostsLogged,
} = require("../lib/aggregations/user/logged");
const {
  getUserFollowingUnlogged,
  getUserFollowersUnLogged,
  userAllLikedUnLogged,
} = require("../lib/aggregations/user/unLogged");

const {
  UserModel,
  FollowersModel,
  Post,
  LikesModel,
  CommentModel,
} = require("../models/models");
const mongoose = require("mongoose");

module.exports = (app) => {
  app.get("/profile/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not Found" });
      } else {
        const userObject = user.toObject();
        delete userObject.password;
        return res.status(200).send(userObject);
      }
    } catch (error) {
      console.log("an error has Occured at /profile/:userId", error);
      return res.status(500).send({ message: "An error has occured" });
    }
  });

  app.get("/:user/posts", async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.user);
    const loggedUserId = req.user?._id
      ? new mongoose.Types.ObjectId(req.user?._id)
      : null;

    try {
      if (loggedUserId) {
        const postArr = await Post.aggregate(
          userPostsLogged(userId, loggedUserId)
        );
        return res.status(200).send(postArr);
      } else {
        const postArr = await Post.aggregate([
          { $match: { parentId: userId } },
          {
            $lookup: {
              from: "users",
              localField: "parentId",
              foreignField: "_id",
              as: "user_info",
            },
          },
          { $unwind: "$user_info" },
        ]);
        return res.status(200).send(postArr);
      }
    } catch (error) {
      console.log("An error has Occured at /:user/posts", error);
      return res.status(500).send({ message: "An error has occured" });
    }
  });

  app.get("/:user/likes", async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.user);
    const loggedUserId = req.user
      ? new mongoose.Types.ObjectId(req.user._id)
      : null;

    try {
      if (loggedUserId) {
        const obj = await LikesModel.aggregate(
          userAllLikedLogged(userId, loggedUserId)
        );
        return res.status(200).send(obj);
      } else {
        const obj = await LikesModel.aggregate(userAllLikedUnLogged(userId));
        return res.status(200).send(obj);
      }
    } catch (err) {
      console.log("An error occured at /:user/likes ", err);
      return res.send({ message: "An error has occured try again later" });
    }
  });

  app.get("/:user/comments", async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.user);
    const loggedUserId = req.user
      ? new mongoose.Types.ObjectId(req.user._id)
      : null;

    const user_info = await UserModel.findById(userId);

    try {
      if (loggedUserId) {
        const obj = await CommentModel.aggregate(
          userCommentsLogged(userId, loggedUserId, user_info)
        );

        return res.status(200).send(obj);
      } else {
        const obj = await CommentModel.aggregate([
          { $match: { userId: userId } },
          {
            $addFields: {
              user_info: user_info,
            },
          },
        ]);
        return res.status(200).send(obj);
      }
    } catch (err) {
      console.log("An error occured at /:user/comments", err);
      return res.send({ message: "An error has occured try again later" });
    }
  });

  app.get("/:user/followers", async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.user);
    const loggedUserId = req.user
      ? new mongoose.Types.ObjectId(req.user._id)
      : null;

    try {
      if (loggedUserId) {
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

  app.get("/:user/following", async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.user);
    const loggedUserId = req.user
      ? new mongoose.Types.ObjectId(req.user._id)
      : null;

    try {
      if (loggedUserId) {
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
      console.log("An error has occured at /:user/following", err);
      return res.send({ message: "something went wrong" });
    }
  });
};
