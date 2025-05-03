const RoleService = require("../services/role.service");

// Lấy toàn bộ vai trò
const getRoles = async (req, res) => {
  try {
    const roles = await RoleService.getAllRoles();
    res.json(roles);
  } catch (error) {
    console.log("role", error);
    res.status(500).json({ error: error.message });
  }
};

// Tạo vai trò mới
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
    console.log("role", error);
    res.status(500).json({ error: error.message });
  }
};

// Lấy vai trò theo ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await RoleService.getRoleById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json(role);
  } catch (error) {
    console.log("role", error);
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật vai trò
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { NAME_ROLE, LIST_PERMISSION, CODE_NAME } = req.body;
    const updated = await RoleService.updateRole(id, {
      NAME_ROLE,
      LIST_PERMISSION,
      CODE_NAME,
    });
    if (!updated) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json({ message: "Role updated" });
  } catch (error) {
    console.log("role", error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa vai trò
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await RoleService.deleteRole(id);
    if (!deleted) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json({ message: "Role deleted" });
  } catch (error) {
    console.log("role", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
};
