const CompanyService = require("../services/company.service");

const getCompanies = async (req, res) => {
  try {
    const companies = await CompanyService.getAllCompanies();
    res.json(companies);
  } catch (error) {
    console.log("company", error);
    res.status(500).json({ error: error.message });
  }
};

const createCompany = async (req, res) => {
  try {
    const data = req.body;
    const id = await CompanyService.createCompany(data);
    res.status(201).json({ message: "Company created", id });
  } catch (error) {
    console.log("company", error);
    res.status(500).json({ error: error.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await CompanyService.getCompanyById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    console.log("company", error);
    res.status(500).json({ error: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await CompanyService.updateCompany(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ message: "Company updated" });
  } catch (error) {
    console.log("company", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CompanyService.deleteCompany(id);
    if (!deleted) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ message: "Company deleted" });
  } catch (error) {
    console.log("company", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCompanies,
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
