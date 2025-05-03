// constants/baseListPermission.js

const baseListPermission = [
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
    router: "dashboard",
    actions: ["access"],
  },
  {
    router: "order",
    actions: ["view", "update", "ship"],
  },
];

module.exports = baseListPermission;
