function fetchDashboardPostsLogged(userId) {
  return [
    { $match: { communityId: { $exists: false } } },
    { $sort: { date: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "parentId",
        foreignField: "_id",
        as: "user_info",
      },
    },
    {
      $unwind: "$user_info",
    },
    {
      $lookup: {
        from: "likes",
        let: { postId: "$_id", userId: userId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$parentId", "$$postId"], /// Changed It MAYBE IT WILL CAUSE PROBLEMS
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
        liked: { $gt: [{ $size: "$likes" }, 0] },
        isAuthor: {
          $cond: {
            if: { $eq: [userId, "$parentId"] },
            then: true,
            else: "$$REMOVE",
          },
        },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
  ];
}

const fetchPostLogged = (postId, userId) => {
  return [
    { $match: { _id: postId } },
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
        let: { userId: userId, postId: postId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$postId", "$parentId"] },
                  { $eq: ["$$userId", "$userId"] },
                ],
              },
            },
          },
        ],
        as: "like",
      },
    },
    {
      $lookup: {
        from: "followers",
        let: { userId: userId, postUserId: "$user_info._id" }, /////// STOPPED HERE !!!! NEED TO CHECK IF LOGGED USER FOLLOWS THE USER WHO POSTED!
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
            if: { $gt: [{ $size: "$like" }, 0] },
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
        like: 0,
        followers: 0,
      },
    },
  ];
};

exports.fetchDashboardPostsLogged = fetchDashboardPostsLogged;
exports.fetchPostLogged = fetchPostLogged;
