function fetchCommentPost(postId, userId) {
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
        foreignField: "_id",
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

exports.fetchComments = fetchComments;
exports.fetchCommentsLogged = fetchCommentsLogged;
exports.fetchCommentPost = fetchCommentPost;
