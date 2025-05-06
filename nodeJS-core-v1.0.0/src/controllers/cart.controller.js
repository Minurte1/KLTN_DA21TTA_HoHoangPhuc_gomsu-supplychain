const CartService = require("../services/cart.service");

const getAllCarts = async (req, res) => {
  try {
    const carts = await CartService.getAll();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    const { ID_PRODUCT, ID_USERS } = req.body;
    const id = await CartService.create({ ID_PRODUCT, ID_USERS });
    res.status(201).json({ message: "Cart created", id });
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
  getAllCarts,
  createCart,
  getCartById,
  updateCart,
  deleteCart,
};
