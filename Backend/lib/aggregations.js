const mongoose = require("mongoose");

const fetchPost = (id) => {
  return [
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "users",
        let: { userId: "$parentId" },
        pipeline: [{ $match: { $expr: { $eq: ["$email", "$$userId"] } } }],
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
    {
      $lookup: {
        from: "likes",
        let: { userId: "$parentId", postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      { $toString: "$parentId" },
                      { $toString: "$$postId" },
                    ],
                  },
                  { $eq: ["$userId", "$$userId"] },
                ],
              },
            },
          },
        ],
        as: "like",
      },
    },
    {
      $addFields: {
        liked: {
          $cond: {
            if: { $gt: [{ $size: "$like" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        like: 0,
      },
    },
  ];
};

function fetchCommentPost(postId, userId) {
  return [
    { $match: { _id: new mongoose.Types.ObjectId(postId) } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "email",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
    {
      $lookup: {
        from: "likes",
        let: { parentId: "$_id", userId: userId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      { $toString: "$parentId" },
                      { $toString: "$$parentId" },
                    ],
                  },
                  { $eq: ["$userId", "$$userId"] },
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
        liked: {
          $cond: {
            if: { $gt: [{ $size: "$likes" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
  ];
}

function fetchComments(postId) {
  return [
    { $match: { parentId: postId } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "email",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
  ];
}

function fetchCommentsLogged(postId, userId) {
  return [
    { $match: { parentId: postId } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "email",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
    {
      $lookup: {
        from: "likes",
        let: { parentId: "$_id", userId: userId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      { $toString: "$parentId" },
                      { $toString: "$$parentId" },
                    ],
                  },
                  { $eq: ["$userId", "$$userId"] },
                ],
              },
            },
          },
        ],
        as: "like",
      },
    },
    {
      $addFields: {
        liked: {
          $cond: {
            if: { $gt: [{ $size: "$like" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        like: 0,
      },
    },
  ];
}

exports.fetchPost = fetchPost;
exports.fetchComments = fetchComments;
exports.fetchCommentsLogged = fetchCommentsLogged;
exports.fetchCommentPost = fetchCommentPost;
