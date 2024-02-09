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
const bcrypt = require("bcrypt");
const { authGuard } = require("../middlewares/authGuard");

module.exports = (app) => {
  app.get("/profile/:userId", async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const loggedUserId = req.user
      ? new mongoose.Types.ObjectId(req.user?._id)
      : null;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not Found" });
      }

      const isFollowing = await FollowersModel.findOne({
        parentId: loggedUserId,
        follows: userId,
      });

      if (isFollowing) {
        const userObject = user.toObject();
        delete userObject.password;
        userObject.isFollowing = true;
        return res.status(200).send(userObject);
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

  app.get("/user/:userId/posts", async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const loggedUserId = req.user
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

  app.get("/user/:user/likes", async (req, res) => {
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

  app.get("/user/:user/comments", async (req, res) => {
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

  app.get("/user/:user/followers", async (req, res) => {
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

  app.get("/user/:user/following", async (req, res) => {
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

  app.put("/user/edit/password", authGuard, async (req, res) => {
    const user = req.user;

    try {
      const userInfo = await UserModel.findById(user._id);
      const { newPassword, oldPassword } = req.body;

      if (!userInfo)
        return res.status(401).message({ message: "Unauthorized" });

      const validateOldPassword = await bcrypt.compare(
        oldPassword,
        userInfo.password
      );

      if (!validateOldPassword)
        return res.status(403).send({ message: "Bad Request" });

      const validateDifferentPasswords = await bcrypt.compare(
        newPassword,
        userInfo.password
      );

      if (validateDifferentPasswords) {
        return res.status(400).send({ message: "Bad Request" });
      }

      const hashedNewPass = await bcrypt.hash(newPassword, 10);

      const changed = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { password: hashedNewPass }
      );

      console.log(changed);
      return res.status(200).send({ message: "Success" });
    } catch (error) {
      console.log("An error has occurred at /use/edit/password", error);
      return res.status(500).send({ message: "Server Error" });
    }
  });

  app.put("/user/edit/info", authGuard, async (req, res) => {
    const loggedUser = req.user;
    const userId = new mongoose.Types.ObjectId(req.query.userId);
    const userChangedInfo = req.body;
    console.log(req.body);
    try {
      if (!userId.equals(loggedUser._id))
        return res.status(401).send({ message: "Unauthorized" });

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: userChangedInfo },
        { new: true, upsert: false }
      );
      console.log(updatedUser);
      return res.status(200).send(updatedUser);
    } catch (error) {
      console.log("An error has occurred at /user/edit/info", error);
      return res.status(500).send({ message: "Server Error" });
    }
  });

  app.delete("/user/:userId", authGuard, async (req, res) => {
    const loggedUser = req.user;
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    try {
      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).send({ message: "User not found" });

      if (!loggedUser.admin && !loggedUser._id.equals(userId)) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      await UserModel.findOneAndDelete({ _id: userId });
      await Post.deleteMany({ parentId: userId });
      await CommentModel.deleteMany({ userId: userId });
      await LikesModel.deleteMany({ userId: userId });
      await LikesModel.deleteMany({ authorId: userId });
      return res.status(200).send({ message: "User deleted successfuly" });
    } catch (error) {
      console.log("An error occured at /user/:userId delete method", error);
      return res.status(500).send({ message: "Server error" });
    }
  });
};
