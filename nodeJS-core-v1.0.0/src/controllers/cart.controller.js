const CartService = require("../services/cart.service");

const getCartsByUser = async (req, res) => {
  try {
    const { ID_USERS } = req.params;
    if (!ID_USERS) {
      return res.status(400).json({ error: "ID_USERS is required" });
    }

    const carts = await CartService.getByUser(ID_USERS);

    if (!carts || carts.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    const {
      ID_PRODUCT_INSTANCE,
      ID_USERS,
      CREATED_AT_CART,
      ID_COMPANY,
      QUANTITY,
    } = req.body;

    // Gọi service để xử lý thêm hoặc cập nhật
    const id = await CartService.createOrUpdate({
      ID_PRODUCT_INSTANCE,
      ID_USERS,
      CREATED_AT_CART,
      ID_COMPANY,
      QUANTITY,
    });

    res.status(201).json({ message: "Cart created or updated", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await CartService.getById(id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { ID_PRODUCT, ID_USERS } = req.body;
    const updated = await CartService.update(id, { ID_PRODUCT, ID_USERS });
    if (!updated) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json({ message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CartService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json({ message: "Cart deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCartsByUser,
  createCart,
  getCartById,
  updateCart,
  deleteCart,
};
