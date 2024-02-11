function fetchCommentPostLogged(postId, userId) {
  return [
    { $match: { _id: postId } },
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
        let: { parentId: "$_id", userId: userId },
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
      $lookup: {
        from: "followers",
        let: { userId: userId, postUserId: "$user_info._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$userId", "$parentId"] },
                  { $eq: ["$$postUserId", "$follows"] },
                ],
              },
            },
          },
        ],
        as: "followers",
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
        "user_info.isFollowing": {
          $cond: {
            if: { $gt: [{ $size: "$followers" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        followers: 0,
        likes: 0,
        "user_info.password": 0,
      },
    },
  ];
}

function fetchCommentsLogged(postId, userId) {
  return [
    { $match: { parentId: postId } },
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
        let: { parentId: "$_id", userId: userId },
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
        isAuthor: {
          $eq: [userId, "$user_info._id"],
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

exports.fetchCommentPostLogged = fetchCommentPostLogged;
exports.fetchCommentsLogged = fetchCommentsLogged;
