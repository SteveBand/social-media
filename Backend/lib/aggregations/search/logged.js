function fetchPostsLogged(regex, userId) {
  return [
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
  ];
}

function fetchUsersLogged(regex, userId) {
  return [
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
  ];
}

function fetchCommentsLogged(regex, userId) {
  return [
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
  ];
}

exports.fetchPostsLogged = fetchPostsLogged;
exports.fetchUsersLogged = fetchUsersLogged;
exports.fetchCommentsLogged = fetchCommentsLogged;
