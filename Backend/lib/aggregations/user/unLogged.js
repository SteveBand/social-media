function getUserFollowingUnlogged(userId) {
  return [
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
  ];
}

///////////////// ////////////// /////////////// /////////////////
function getUserFollowersUnLogged(userId) {
  return [
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
  ];
}

///////////////

function userAllLikedUnLogged(userId) {
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
      $replaceRoot: {
        newRoot: "$resultArray",
      },
    },
  ];
}

function userPostsUnLogged() {}

exports.getUserFollowingUnlogged = getUserFollowingUnlogged;
exports.getUserFollowersUnLogged = getUserFollowersUnLogged;
exports.userAllLikedUnLogged = userAllLikedUnLogged;
exports.userPostsUnLogged = userPostsUnLogged;
