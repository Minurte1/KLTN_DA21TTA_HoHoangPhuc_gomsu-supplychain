const CompanyTypeService = require("../services/companyType.service");
const db = require("../config/database");
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
    const { NAME_COMPANY_TYPE, ROUTER_COMPANY } = req.body;
    const id = await CompanyTypeService.createCompanyType({
      NAME_COMPANY_TYPE,
      ROUTER_COMPANY,
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
    const { NAME_COMPANY_TYPE, ROUTER_COMPANY } = req.body;
    const updated = await CompanyTypeService.updateCompanyType(id, {
      NAME_COMPANY_TYPE,
      ROUTER_COMPANY,
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

// Lấy danh sách các công ty vận chuyển
const getCompaniesByRouter = async (req, res) => {
  try {
    const { filters } = req.body;
    console.log("filters", filters);

    if (!filters || !Array.isArray(filters) || filters.length === 0) {
      return res.status(400).json({ error: "Filters array is required" });
    }

    const routerFilter = filters.find((f) => f.key === "ROUTER_COMPANY");
    if (!routerFilter || !routerFilter.value) {
      return res
        .status(400)
        .json({ error: "ROUTER_COMPANY filter is required" });
    }

    const routerValue = routerFilter.value;

    // Step 1: Lấy danh sách công ty phù hợp
    const companyQuery = `
      SELECT 
        c.ID_COMPANY,
        c.NAME_COMPANY,
        c.TYPE_COMPANY,
        c.ADDRESS,
        c.DIA_CHI_Provinces,
        c.DIA_CHI_Districts,
        c.DIA_CHI_Wards,
        c.DIA_CHI_STREETNAME,
        c.PHONE,
        c.EMAIL,
        c.AVATAR,
        c.SLUG,
        c.CREATED_AT AS COMPANY_CREATED_AT,
        c.UPDATED_AT AS COMPANY_UPDATED_AT,
        c.STATUS AS COMPANY_STATUS,
        c.ID_COMPANY_TYPE,
        ct.NAME_COMPANY_TYPE,
        ct.ROUTER_COMPANY
      FROM companies c
      INNER JOIN company_types ct ON c.ID_COMPANY_TYPE = ct.ID_COMPANY_TYPE
      WHERE ct.ROUTER_COMPANY LIKE ?
    `;

    const [companies] = await db.query(companyQuery, [`%${routerValue}%`]);

    if (!companies || companies.length === 0) {
      return res.status(200).json([]); // Không có công ty nào
    }

    // Step 2: Lấy danh sách phí dịch vụ dựa trên ID_COMPANY
    const companyIds = companies.map((c) => c.ID_COMPANY);
    const feeQuery = `
      SELECT 
        tsf.ID_FEE,
        tsf.ID_COMPANY_SHIP,
        tsf.SERVICE_NAME,
        tsf.UNIT,
        tsf.PRICE,
        tsf.NOTE,
        tsf.STATUS AS FEE_STATUS,
        tsf.CREATED_AT AS FEE_CREATED_AT,
        tsf.UPDATED_AT AS FEE_UPDATED_AT
      FROM transport_service_fees tsf
      WHERE tsf.ID_COMPANY_SHIP IN (?)
    `;
    const [fees] = await db.query(feeQuery, [companyIds]);

    // Gắn fees vào từng company tương ứng
    const companiesWithFees = companies.map((company) => {
      const companyFees = fees.filter(
        (f) => f.ID_COMPANY_SHIP === company.ID_COMPANY
      );
      return {
        ...company,
        transport_service_fees: companyFees,
      };
    });

    return res.status(200).json(companiesWithFees);
  } catch (error) {
    console.error("Error in getCompaniesByRouter:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getCompanyTypes,
  createCompanyType,
  getCompanyTypeById,
  updateCompanyType,
  deleteCompanyType,
  getCompaniesByRouter,
};
