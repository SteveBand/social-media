function postsIfUserLogged(userId) {
  return [
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
        liked: { $ne: [{ $size: "$likes" }, 0] },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
  ];
}

const postsIfNoUser = [
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
      let: { postId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [{ $toString: "$parentId" }, { $toString: "$$postId" }],
                },
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
      from: "comments",
      let: { postId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: {
                $eq: [{ $toString: "$parentId" }, { $toString: "$postId" }],
              },
            },
          },
        },
      ],
      as: "comments",
    },
  },

  {
    $project: {
      likes: 0,
      comments: 0,
    },
  },
];

exports.postsIfNoUser = postsIfNoUser;
exports.postsIfUserLogged = postsIfUserLogged;
