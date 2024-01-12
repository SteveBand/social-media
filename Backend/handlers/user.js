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

  app.get("/:user/followers", catchCookies, async (req, res) => {
    const userId = req.params.user;
    const loggedUserId = req.userData.email;
    console.log(loggedUserId);
    if (!userId) {
      return res.send({ message: "User not Found!" });
    }
    try {
      const obj = await FollowersModel.aggregate([
        { $match: { follows: userId } },
        {
          $lookup: {
            from: "users",
            localField: "parentId",
            foreignField: "email",
            as: "user_info",
          },
        },
        { $unwind: "$user_info" },
        {
          $lookup: {
            from: "followers",
            let: { userId: "$user_info.email", parentId: loggedUserId },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$parentId", "$$parentId"] },
                      { $eq: ["$follows", "$$userId"] },
                    ],
                  },
                },
              },
            ],
            as: "following",
          },
        },
        {
          $addFields: {
            "user_info.isFollowing": {
              $cond: {
                if: { $gt: [{ $size: "$following" }, 0] },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            parentId: 0,
            follows: 0,
            following: 0,
          },
        },
        {
          $replaceRoot: {
            newRoot: "$user_info",
          },
        },
      ]);
      console.log(obj);
      return res.send(obj).status(200);
    } catch (err) {
      console.log("An error occured at /:user/followers", err.name);
      return res.send({ message: "An error has Occured" }).status(400);
    }
  });

  app.get("/:user/following", catchCookies, async (req, res) => {
    const userId = req.params.user;
    const loggedUserId = req.userData.email;
    if (!userId) {
      return res.send({ message: "User not found!" });
    }
    try {
      const obj = await FollowersModel.aggregate([
        {
          $match: { parentId: userId },
        },
        {
          $lookup: {
            from: "users",
            localField: "follows",
            foreignField: "email",
            as: "user_info",
          },
        },
        { $unwind: "$user_info" },
        {
          $addFields: {
            "user_info.isFollowing": {
              $and: [
                { $eq: ["$parentId", loggedUserId] },
                { $eq: ["$follows", "$user_info.email"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            parentId: 0,
            follows: 0,
          },
        },
        {
          $replaceRoot: {
            newRoot: "$user_info",
          },
        },
      ]);

      return res.send(obj).status(200);
    } catch (err) {
      console.log("An error has occured at /:user/followes", err);
      return res.send({ message: "something went wrong" });
    }
  });
};
