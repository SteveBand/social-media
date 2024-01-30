const mongoose = require("mongoose");

function fetchDashboardPostsUnLogged() {
  return [
    { $match: { communityId: { $exists: false } } },
    { $sort: { date: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "parentId",
        foreignField: "_id",
        as: "user_info",
      },
    },
    {
      $unwind: "$user_info",
    },
  ];
}

function fetchPostUnLogged(postId) {
  return [
    { $match: { _id: new mongoose.Types.ObjectId(postId) } },
    {
      $lookup: {
        from: "users",
        let: { userId: "$parentId" },
        pipeline: [{ $match: { $expr: { $eq: ["$email", "$$userId"] } } }],
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
  ];
}

exports.fetchDashboardPostsUnLogged = fetchDashboardPostsUnLogged;
exports.fetchPostUnLogged = fetchPostUnLogged;
