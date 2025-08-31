const CompanyService = require("../services/company.service");

const getCompanies = async (req, res) => {
  try {
    const { ID_COMPANY, STATUS, ID_COMPANY_TYPE, TABLE } = req.query;

    const companies = await CompanyService.getAllCompanies(
      ID_COMPANY,
      STATUS,
      ID_COMPANY_TYPE,
      TABLE
    );

    res.json({
      EM: "Lấy danh sách công ty thành công",
      EC: 1,
      DT: companies,
    });
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
const createCompany = async (req, res) => {
  try {
    const data = req.body;

    if (req.files) {
      if (req.files.AVATAR && req.files.AVATAR[0]) {
        data.AVATAR = `/images/${req.files.AVATAR[0].filename}`;
      }
      if (req.files.BACKGROUND && req.files.BACKGROUND[0]) {
        data.BACKGROUND = `/images/${req.files.BACKGROUND[0].filename}`;
      }
    }

    const id = await CompanyService.createCompany(data);
    res.status(201).json({ message: "Company created", id });
  } catch (error) {
    console.log("company", error);
    res.status(500).json({ error: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    // Hàm cắt URL chỉ lấy phần /images/...
    const stripImagePath = (url) => {
      if (typeof url === "string") {
        const index = url.indexOf("/images/");
        if (index !== -1) {
          return url.slice(index);
        }
      }
      return url;
    };

    // Nếu có file mới từ upload
    if (req.files?.AVATAR?.[0]) {
      data.AVATAR = `/images/${req.files.AVATAR[0].filename}`;
    } else if (data.AVATAR) {
      // Nếu AVATAR là URL đầy đủ => cắt ra
      data.AVATAR = stripImagePath(data.AVATAR);
    }

    if (req.files?.BACKGROUND?.[0]) {
      data.BACKGROUND = `/images/${req.files.BACKGROUND[0].filename}`;
    } else if (data.BACKGROUND) {
      // Nếu BACKGROUND là URL đầy đủ => cắt ra
      data.BACKGROUND = stripImagePath(data.BACKGROUND);
    }

    const updated = await CompanyService.updateCompany(id, data);

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
