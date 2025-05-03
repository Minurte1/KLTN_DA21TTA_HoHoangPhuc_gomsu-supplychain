const baseListPermission = require("../middleware/checkUserPermission");

const getBaseListPermission = (req, res) => {
  res.json(baseListPermission);
};

module.exports = {
  getBaseListPermission,
};
