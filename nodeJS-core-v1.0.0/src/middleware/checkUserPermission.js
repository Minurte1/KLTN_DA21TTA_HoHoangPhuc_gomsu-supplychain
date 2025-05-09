// constants/baseListPermission.js

const baseListPermission = [
  {
    router: "dashboard",
    actions: ["access"],
  },
  {
    router: "role",
    actions: ["view", "create", "update", "delete"],
  },
  {
    router: "user",
    actions: ["view", "create", "update", "delete"],
  },
  {
    router: "product",
    actions: ["view", "create", "update", "delete"],
  },

  {
    router: "order",
    actions: ["view", "update", "ship"],
  },
];

module.exports = baseListPermission;
