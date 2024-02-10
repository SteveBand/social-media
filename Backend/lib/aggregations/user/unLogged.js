function getUserFollowingUnlogged(userId) {
  return [
    {
      $match: { parentId: userId },
    },
    //Iterating and fetching every user Data
    {
      $lookup: {
        from: "users",
        localField: "follows",
        foreignField: "_id",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
    // filtering unneccessery or sensitive content
    {
      $project: {
        _id: 0,
        parentId: 0,
        follows: 0,
        "user_info.password": 0,
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
    //Iterating and fetching every user Data
    {
      $lookup: {
        from: "users",
        localField: "parentId",
        foreignField: "_id",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
    // filtering unneccessery or sensitive content
    {
      $project: {
        _id: 0,
        parentId: 0,
        follows: 0,
        following: 0,
        "user_info.password": 0,
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
    //Iterating and fetching every user Data
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
    // filtering unneccessery or sensitive content and combinging 2 Arrays of posts and comments together to a single array
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
      $addFields: {
        "resultArray.user_info": "$user_info", /// pushing user_info into resultArray.user_info field
      },
    },

    {
      $project: {
        "resultArray.user_info.password": 0,
      },
    },

    {
      $replaceRoot: {
        newRoot: "$resultArray",
      },
    },
  ];
}

exports.getUserFollowingUnlogged = getUserFollowingUnlogged;
exports.getUserFollowersUnLogged = getUserFollowersUnLogged;
exports.userAllLikedUnLogged = userAllLikedUnLogged;
