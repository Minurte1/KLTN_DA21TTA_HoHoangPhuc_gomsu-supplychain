const RoleService = require("../services/role.service");

const getRoles = async (req, res) => {
  try {
    const roles = await RoleService.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { NAME_ROLE, LIST_PERMISSION, CODE_NAME } = req.body;
    const id = await RoleService.createRole({
      NAME_ROLE,
      LIST_PERMISSION,
      CODE_NAME,
    });
    res.status(201).json({ message: "Role created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRoles,
  createRole,
};
