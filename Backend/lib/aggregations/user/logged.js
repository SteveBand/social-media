function getUserFollowingLogged(userId, loggedUserId) {
  return [
    {
      $match: { parentId: userId },
    },
    //On each iteration getting the user information from DB
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
          // Adds new fields that checks if the logged user is following the user
          $and: [
            { $eq: ["$parentId", loggedUserId] },
            { $eq: ["$follows", "$user_info._id"] },
          ],
        },
      },
    },
    // Hiding unneccessry info
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

///////////// ////////////////////   ////////////////   ////////////////

function getUserFollowersLogged(userId, loggedUserId) {
  return [
    { $match: { follows: userId } }, /// Gets all followers the user Have

    //On each iteration getting the user information from DB
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
        let: { userId: "$user_info._id", parentId: loggedUserId }, /// Checks if the loggedUser is following the current user in the iteration
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
    /// Filtering unneccessery Information
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

function userAllLikedLogged(userId, loggedUserId) {
  return [
    { $match: { userId: userId } },
    {
      $lookup: {
        from: "users",
        localField: "authorId", //On each iteration getting the user information from DB
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
    /// Iterating through Posts and Comments models to pull all connected document to likes
    {
      $lookup: {
        from: "comments",
        localField: "parentId",
        foreignField: "_id",
        as: "comments",
      },
    },
    /// filtering  unneccessery or Sensitive Information
    {
      $project: {
        _id: 0,
        parentId: 0,
        userId: 0,
        __v: 0,
        "user_info.password": 0,
      },
    },
    {
      $project: {
        resultArray: {
          $concatArrays: ["$posts", "$comments"], /// Combining both posts and comments arrays as a result from both $lookups
        },
        user_info: "$user_info",
      },
    },
    {
      $unwind: "$resultArray",
    },

    /// Checking is loggedUser liked one of them as well
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

    /// adding new field to every post or comment if user has liked it
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

    //Checking if logged User has liked the comment using $lookup
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
            if: { $gt: [{ $size: "$likes" }, 0] }, ///if user liked then true if not then false
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

    /// Fetching user data from DB
    {
      $lookup: {
        from: "users",
        localField: "parentId",
        foreignField: "_id",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },

    // Iterating through likes model to check if logged user Has liked
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

    // adding liked field
    {
      $addFields: {
        liked: {
          $cond: {
            if: { $gt: [{ $size: "$likes" }, 0] }, /// if user like then true if not then fale
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        "user_info.password": 0,
        likes: 0,
      },
    },
  ];
};

exports.getUserFollowingLogged = getUserFollowingLogged;
exports.getUserFollowersLogged = getUserFollowersLogged;
exports.userAllLikedLogged = userAllLikedLogged;
exports.userCommentsLogged = userCommentsLogged;
exports.userPostsLogged = userPostsLogged;
