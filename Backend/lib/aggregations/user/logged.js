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

///////////// ////////////////////   ////////////////   ////////////////

function getUserFollowersLogged(userId, loggedUserId) {
  return [
    { $match: { follows: userId } },
    {
      $lookup: {
        from: "users",
        localField: "parentId",
        foreignField: "email",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
    {
      $lookup: {
        from: "followers",
        let: { userId: "$user_info.email", parentId: loggedUserId },
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

exports.getUserFollowingLogged = getUserFollowingLogged;
exports.getUserFollowersLogged = getUserFollowersLogged;
