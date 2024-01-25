function getUserFollowingLogged(userId, loggedUserId) {
  [
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
  ];
}

///////////// ////////////////////   ////////////////   ////////////////

function getUserFollowersLogged(userId, loggedUserId) {
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
  ];
}

function userAllLikedLogged(userId, loggedUserId) {
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

function userCommentsLogged(userId, loggedUserId) {
  return [
    { $match: { userId: userId } },
    {
      $lookup: {
        from: "likes",
        let: { userId: loggedUserId, parentId: "$_id" },
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

const userPostsLogged = (userId, loggedUserId) => {
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
        let: { parentId: "$_id", userId: loggedUserId },
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

exports.getUserFollowingLogged = getUserFollowingLogged;
exports.getUserFollowersLogged = getUserFollowersLogged;
exports.userAllLikedLogged = userAllLikedLogged;
exports.userCommentsLogged = userCommentsLogged;
exports.userPostsLogged = userPostsLogged;
