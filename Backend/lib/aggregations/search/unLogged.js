function fetchPostsUnLogged(regex) {
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
      $project: {
        "user_info.password": 0,
      },
    },
  ];
}

function fetchCommentsUnLogged(regex) {
  return [
    { $match: { content: regex } },
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

exports.fetchPostsUnLogged = fetchPostsUnLogged;
exports.fetchCommentsUnLogged = fetchCommentsUnLogged