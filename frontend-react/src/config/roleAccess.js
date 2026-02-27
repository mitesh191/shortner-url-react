const roleAccess = {
  superadmin: [
    "/dashboard",
    "/create-client",
    "/clients",
    "/short-urls"
  ],

  admin: [
    "/dashboard",
    "/create-member",
    "/team-members",
    "/short-urls"
  ],

  member: [
    "/dashboard",
    "/short-urls"
  ]
};

export default roleAccess;