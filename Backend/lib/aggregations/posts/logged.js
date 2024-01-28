function fetchDashboardPostsLogged(userId) {
  return [
    { $match: { communityId: { $exists: false } } },
    { $sort: { date: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "parentId",
        foreignField: "email",
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
                    $eq: [
                      { $toString: "$parentId" },
                      { $toString: "$$postId" },
                    ],
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

const fetchPostLogged = (postId, loggedUserId) => {
  return [
    { $match: { _id: new mongoose.Types.ObjectId(postId) } },
    {
      $lookup: {
        from: "users",
        let: { userId: "$parentId" },
        pipeline: [{ $match: { $expr: { $eq: ["$email", "$$userId"] } } }],
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },
    {
      $lookup: {
        from: "likes",
        let: { loggedUserId: loggedUserId, postId: postId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$postId, $parentId"] },
                  { $eq: ["$$loggedUserId", "$userId"] },
                ],
              },
            },
          },
        ],
        as: "liked",
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
      },
    },
    {
      $project: {
        like: 0,
      },
    },
  ];
};

exports.fetchDashboardPostsLogged = fetchDashboardPostsLogged;
exports.fetchPostLogged = fetchPostLogged;
