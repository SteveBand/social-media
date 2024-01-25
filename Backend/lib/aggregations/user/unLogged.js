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

exports.getUserFollowingUnlogged = getUserFollowingUnlogged;
