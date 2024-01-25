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

exports.getUserFollowingLogged = getUserFollowingLogged;
