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
        console.log(usersArr);
        return res.status(200).send(usersArr);
      } else {
        const usersArr = await UserModel.find({ name: regex });
        return res.status(200).send(usersArr);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server error occured" });
    }
  });
};
