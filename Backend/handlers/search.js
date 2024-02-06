const {
  Post,
  UserModel,
  CommentModel,
  Community,
} = require("../models/models");
const mongoose = require("mongoose");

module.exports = (app) => {
  app.get("/search/users", async (req, res) => {
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;
    const query = req.query.q;
    const regex = new RegExp(query, "i");
    try {
      if (query.length <= 2) {
        return res.status(400).send({ message: "Bad Request" });
      }
      if (userId) {
        const usersArr = await UserModel.aggregate([
          { $match: { name: regex } },
          {
            $lookup: {
              from: "followers",
              let: { userId: userId, follows: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$parentId", "$$userId"] },
                        { $eq: ["$follows", "$$follows"] },
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
              isFollowing: { $gt: [{ $size: ["$following"] }, 0] },
            },
          },
          {
            $project: {
              password: 0,
              updatedAt: 0,
              following: 0,
            },
          },
        ]);
        return res.status(200).send(usersArr);
      } else {
        const usersArr = await UserModel.find({ name: regex }, { password: 0 });
        return res.status(200).send(usersArr);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server error occured" });
    }
  });

  app.get("/search/posts", async (req, res) => {
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;
    const query = req.query.q;
    const regex = new RegExp(query, "i");

    try {
      if (userId) {
        const postsArr = await Post.aggregate([
          { $match: { content: regex } },
          {
            $lookup: {
              from: "users",
              localField: "parentId",
              foreignField: "_id",
              as: "user_info",
            },
          },
          { $unwind: "$user_info" },
          {
            $lookup: {
              from: "likes",
              let: { userId: userId, postId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$parentId", "$$postId"] },
                        { $eq: ["$userId", "$$userId"] },
                      ],
                    },
                  },
                },
              ],
              as: "likedPost",
            },
          },

          {
            $addFields: {
              liked: { $gt: [{ $size: "$likedPost" }, 0] },
            },
          },

          {
            $project: {
              likedPost: 0,
            },
          },
        ]);
        console.log(postsArr);
        return res.status(200).send(postsArr);
      } else {
        const postsArr = await Post.aggregate([
          { $match: { content: regex } },
          {
            $lookup: {
              from: "users",
              localField: "parentId",
              foreignField: "_id",
              as: "user_info",
            },
          },
          { $unwind: "$user_info" },
          {
            $project: {
              "user_info.password": 0,
            },
          },
        ]);
        return res.status(200).send(postsArr);
      }
    } catch (error) {
      console.log("/search/posts error path", error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.get("/search/comments", async (req, res) => {
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;
    const query = req.query.q;
    const regex = new RegExp(query, "i");
    try {
      if (userId) {
        const commentsArr = await CommentModel.aggregate([
          {
            $match: { content: regex },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user_info",
            },
          },
          { $unwind: "$user_info" },
          {
            $lookup: {
              from: "likes",
              let: { userId: userId, parentId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$userId", "$$userId"] },
                        { $eq: ["$parentId", "$$parentId"] },
                      ],
                    },
                  },
                },
              ],
              as: "likes",
            },
          },
          {
            $addFields: {
              liked: { $gt: [{ $size: "$likes" }, 0] },
            },
          },

          {
            $project: {
              likes: 0,
              "user_info.password": 0,
            },
          },
        ]);
        return res.status(200).send(commentsArr);
      } else {
        const commentsArr = await CommentModel.aggregate([
          { $match: { content: regex } },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user_info",
            },
          },
          { $unwind: "$user_info" },
        ]);
        return res.status(200).send(commentsArr);
      }
    } catch (error) {
      console.log("An error has occurred at /search/comments", error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.get("/search/communities", async (req, res) => {
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;
    const query = req.query.q;
    const regex = new RegExp(query, "i");

    const communitiesArr = Community.find({ title: regex });
  });
};
