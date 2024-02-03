function getUserFollowingLogged(userId, loggedUserId) {
  return [
    {
      $match: { parentId: userId },
    },
    {
      $lookup: {
        from: "users",
        localField: "follows",
        foreignField: "_id",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
    {
      $addFields: {
        "user_info.isFollowing": {
          $and: [
            { $eq: ["$parentId", loggedUserId] },
            { $eq: ["$follows", "$user_info._id"] },
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
        foreignField: "_id",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
    {
      $lookup: {
        from: "followers",
        let: { userId: "$user_info._id", parentId: loggedUserId },
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
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
    {
      $lookup: {
        from: "posts",
        localField: "parentId",
        foreignField: "_id",
        as: "posts",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "parentId",
        foreignField: "_id",
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
        user_info: "$user_info",
      },
    },
    {
      $unwind: "$resultArray",
    },
    {
      $lookup: {
        from: "likes",
        let: { loggedUserId: loggedUserId, parentId: "$resultArray._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$parentId", "$parentId"] },
                  { $eq: ["$$loggedUserId", "$userId"] },
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
        "resultArray.liked": {
          $cond: {
            if: { $gt: [{ $size: "$likes" }, 0] },
            then: true,
            else: false,
          },
        },
        "resultArray.user_info": "$user_info",
      },
    },
    {
      $replaceRoot: {
        newRoot: "$resultArray",
      },
    },
  ];
}

function userCommentsLogged(userId, loggedUserId, user_info) {
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
                    $eq: ["$parentId", "$$parentId"],
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
        user_info: user_info,
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
        foreignField: "_id",
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
                    $eq: ["$$parentId", "$parentId"],
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
