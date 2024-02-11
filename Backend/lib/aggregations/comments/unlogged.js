function fetchCommentPostUnLogged(postId) {
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
      $project: {
        "user_info.password": 0,
      },
    },
  ];
}

function fetchCommentsUnlogged(postId) {
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

exports.fetchCommentPostUnLogged = fetchCommentPostUnLogged;
exports.fetchCommentsUnlogged = fetchCommentsUnlogged;
