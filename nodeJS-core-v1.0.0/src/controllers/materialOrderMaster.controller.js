const MaterialOrderOrdersService = require("../services/materialOrderMaster.service");

const getAllMaterialOrdersMaster = async (req, res) => {
  try {
    const materialOrders = await MaterialOrderOrdersService.getAll();
    res.json(materialOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMaterialOrderMaster = async (req, res) => {
  try {
    const {
      ID_COMPANY_BUYER,
      ID_COMPANY_SELLER,
      ID_COMPANY_SHIP,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
    } = req.body;

    const id = await MaterialOrderOrdersService.create({
      ID_COMPANY_BUYER,
      ID_COMPANY_SELLER,
      ID_COMPANY_SHIP,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
      CREATED_AT: new Date(), // tự sinh CREATED_AT
    });

    res.status(201).json({ message: "Material Order created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMaterialOrderByIdMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const materialOrder = await MaterialOrderOrdersService.getById(id);
    if (!materialOrder) {
      return res.status(404).json({ message: "Material Order not found" });
    }
    res.json(materialOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMaterialOrderMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ID_COMPANY_BUYER,
      ID_COMPANY_SELLER,
      ID_COMPANY_SHIP,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
    } = req.body;

    const updated = await MaterialOrderOrdersService.update(id, {
      ID_COMPANY_BUYER,
      ID_COMPANY_SELLER,
      ID_COMPANY_SHIP,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
      UPDATED_AT: new Date(), // cập nhật thời gian chỉnh sửa
    });

    if (!updated) {
      return res.status(404).json({ message: "Material Order not found" });
    }

    res.json({ message: "Material Order updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMaterialOrderMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MaterialOrderOrdersService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Material Order not found" });
    }
    res.json({ message: "Material Order deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getOrdersByCompanyAndMaterial = async (req, res) => {
  try {
    const { idCompany, idMaterial } = req.params;

    const orders =
      await MaterialOrderOrdersService.getOrdersByCompanyAndMaterial(
        idCompany,
        idMaterial
      );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMaterialOrdersMaster,
  createMaterialOrderMaster,
  getMaterialOrderByIdMaster,
  updateMaterialOrderMaster,
  deleteMaterialOrderMaster,
  getOrdersByCompanyAndMaterial,
};
