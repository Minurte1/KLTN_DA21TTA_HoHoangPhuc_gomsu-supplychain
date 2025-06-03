const RoleService = require("../services/role.service");

// Lấy toàn bộ vai trò
const getRoles = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;

    const roles = await RoleService.getAllRoles(ID_COMPANY);

    return res.status(200).json({
      EM: "Lấy danh sách vai trò thành công",
      EC: 1,
      DT: roles,
    });
  } catch (error) {
    console.error("Error in getRoles:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

// Tạo vai trò mới
const createRole = async (req, res) => {
  try {
    const { NAME_ROLE, LIST_PERMISSION, CODE_NAME, ID_COMPANY, DESCRIPTION } =
      req.body;
    const id = await RoleService.createRole({
      NAME_ROLE,
      LIST_PERMISSION,
      CODE_NAME,
      ID_COMPANY,
      DESCRIPTION,
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
    const { NAME_ROLE, LIST_PERMISSION, CODE_NAME, DESCRIPTION, ID_COMPANY } =
      req.body;
    const updated = await RoleService.updateRole(id, {
      NAME_ROLE,
      LIST_PERMISSION,
      CODE_NAME,
      ID_COMPANY,
      DESCRIPTION,
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
