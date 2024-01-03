const moongose = require("mongoose");

const userPostsAggregation = (userId) => {
  return [
    { $match: { parentId: userId } },
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
        from: "likes",
        let: { parentId: "$_id", userId: userId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      { $toString: "$$parentId" },
                      { $toString: "$parentId" },
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
};

function userCommentsLikes(userId) {
  return [
    { $match: { userId: userId } },
    {
      $lookup: {
        from: "comments",
        let: { parentId: "$parentId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [{ $toString: "$$parentId" }, { $toString: "$_id" }],
              },
            },
          },
        ],
        as: "comments",
      },
    },
    { $unwind: "$comments" },
  ];
}

function userAllLiked(userId, loggedUserId) {
  return [
    { $match: { userId: userId } },
    {
      $lookup: {
        from: "posts",
        let: { parentId: userId, postId: "$parentId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [{ $toString: "$_id" }, { $toString: "$$postId" }],
              },
            },
          },
        ],
        as: "posts",
      },
    },
    {
      $lookup: {
        from: "comments",
        let: { userId: userId, postId: "$parentId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [{ $toString: "$_id" }, { $toString: "$$postId" }],
              },
            },
          },
        ],
        as: "comments",
      },
    },
    {
      $project: {
        _id: 0,
        parentId: 0,
        userId: 0,
        __v: 0,
      },
    },
    {
      $project: {
        resultArray: {
          $concatArrays: ["$posts", "$comments"],
        },
      },
    },
    {
      $unwind: "$resultArray",
    },
    {
      $addFields: {
        "resultArray.liked": {
          $or: [
            { $eq: [loggedUserId, "$resultArray.userId"] },
            { $eq: [loggedUserId, "$resultArray.parentId"] },
          ],
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: "$resultArray",
      },
    },
  ];
}

exports.userPostsAggregation = userPostsAggregation;
exports.userAllLiked = userAllLiked;
