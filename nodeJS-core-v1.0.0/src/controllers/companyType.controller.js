const CompanyTypeService = require("../services/companyType.service");

// Lấy toàn bộ loại công ty
const getCompanyTypes = async (req, res) => {
  try {
    const types = await CompanyTypeService.getAllCompanyTypes();
    res.json(types);
  } catch (error) {
    console.log("company_type", error);
    res.status(500).json({ error: error.message });
  }
};

// Tạo loại công ty mới
const createCompanyType = async (req, res) => {
  try {
    const { NAME_COMPANY_TYPE } = req.body;
    const id = await CompanyTypeService.createCompanyType({
      NAME_COMPANY_TYPE,
    });
    res.status(201).json({ message: "Company type created", id });
  } catch (error) {
    console.log("company_type", error);
    res.status(500).json({ error: error.message });
  }
};

// Lấy loại công ty theo ID
const getCompanyTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyType = await CompanyTypeService.getCompanyTypeById(id);
    if (!companyType) {
      return res.status(404).json({ message: "Company type not found" });
    }
    res.json(companyType);
  } catch (error) {
    console.log("company_type", error);
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật loại công ty
const updateCompanyType = async (req, res) => {
  try {
    const { id } = req.params;
    const { NAME_COMPANY_TYPE } = req.body;
    const updated = await CompanyTypeService.updateCompanyType(id, {
      NAME_COMPANY_TYPE,
    });
    if (!updated) {
      return res.status(404).json({ message: "Company type not found" });
    }
    res.json({ message: "Company type updated" });
  } catch (error) {
    console.log("company_type", error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa loại công ty
const deleteCompanyType = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CompanyTypeService.deleteCompanyType(id);
    if (!deleted) {
      return res.status(404).json({ message: "Company type not found" });
    }
    res.json({ message: "Company type deleted" });
  } catch (error) {
    console.log("company_type", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCompanyTypes,
  createCompanyType,
  getCompanyTypeById,
  updateCompanyType,
  deleteCompanyType,
};
