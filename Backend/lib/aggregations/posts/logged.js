function fetchDashboardPostsLogged(userId) {
  return [
    { $match: { communityId: { $exists: false } } }, /// Checks if community Id exist and if false then return it if not then skip
    { $sort: { date: -1 } }, /// getting from descending order
    { $limit: 20 }, /// limit of how many documents

    /// Gets Creator info
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

    ///checks for loggedUser likes on posts
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
                    $eq: ["$parentId", "$$postId"],
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
    /// adding liked and is Author fields
    {
      $addFields: {
        liked: { $gt: [{ $size: "$likes" }, 0] },
        isAuthor: {
          $cond: {
            if: { $eq: [userId, "$parentId"] },
            then: true,
            else: "$$REMOVE", /// if is not author then remove the fields and don't send it
          },
        },
      },
    },
    {
      $project: {
        likes: 0, /// removing likes object
        "user_info.password": 0,
      },
    },
  ];
}

const fetchPostLogged = (postId, userId) => {
  return [
    { $match: { _id: postId } },

    /// Gets Creator info
    {
      $lookup: {
        from: "users",
        localField: "parentId",
        foreignField: "_id",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },

    //Checks if the user liked the post
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
    /// checks if the logged user is following the creator of the post
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

    ///adding isFollowing and liked to the returned object
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
        "user_info.password": 0,
      },
    },
  ];
};

exports.fetchDashboardPostsLogged = fetchDashboardPostsLogged;
exports.fetchPostLogged = fetchPostLogged;
