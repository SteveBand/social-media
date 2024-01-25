function fetchDashboardPostsUnLogged() {
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
  ];
}

exports.fetchDashboardPostsUnLogged = fetchDashboardPostsUnLogged;
