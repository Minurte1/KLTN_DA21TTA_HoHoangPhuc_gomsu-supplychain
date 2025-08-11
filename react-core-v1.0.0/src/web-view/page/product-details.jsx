import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import productInstancesServices from "../../services/product_instancesServices";

const ProductDetails = () => {
  const { serialCode } = useParams(); // lấy param SERIAL_CODE từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]); // giỏ hàng lưu các sản phẩm thêm vào
  const [quantity, setQuantity] = useState(1); // số lượng mua

  useEffect(() => {
    if (!serialCode) return;

    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await productInstancesServices.getProductInstancesPublic({
          STATUS: "AVAILABLE",
          SERIAL_CODE: serialCode,
          LIMIT: 1,
        });

        // data trả về là mảng, lấy phần tử đầu tiên
        setProduct(data[0] || null);
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [serialCode]);

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    if (!product) return;

    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingIndex = cart.findIndex(
      (item) => item.ID_PRODUCT_INSTANCE === product.ID_PRODUCT_INSTANCE
    );

    if (existingIndex >= 0) {
      // Cập nhật số lượng
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      // Thêm mới
      setCart([...cart, { ...product, quantity }]);
    }
    alert("Đã thêm vào giỏ hàng!");
  };
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h2>{product.NAME_PRODUCTS}</h2>
      <img
        src={product.IMAGE_URL_PRODUCTS}
        alt={product.NAME_PRODUCTS}
        style={{ width: "100%", maxHeight: 400, objectFit: "contain" }}
      />
      <p>{product.DESCRIPTION_PRODUCTS}</p>
      <p>
        Giá:{" "}
        {product.PRICE_PRODUCTS?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </p>
      <p>
        Tình trạng:{" "}
        {product.STOCK_PRODUCTS > 0
          ? `Còn hàng: ${product.STOCK_PRODUCTS}`
          : "Hết hàng"}
      </p>
      <p>Danh mục: {product.NAME_CATEGORIES_}</p>
      <p>Mã sản phẩm: {product.SERIAL_CODE}</p>

      <div style={{ marginTop: 20 }}>
        <label>
          Số lượng:{" "}
          <input
            type="number"
            min={1}
            max={product.STOCK_PRODUCTS}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.min(
                  product.STOCK_PRODUCTS,
                  Math.max(1, Number(e.target.value))
                )
              )
            }
            style={{ width: 60 }}
          />
        </label>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.STOCK_PRODUCTS === 0}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          backgroundColor: product.STOCK_PRODUCTS === 0 ? "#ccc" : "#007bff",
          color: "#fff",
          border: "none",
          cursor: product.STOCK_PRODUCTS === 0 ? "not-allowed" : "pointer",
          borderRadius: 4,
          fontSize: 16,
        }}
      >
        Thêm vào giỏ hàng
      </button>

      {/* Giỏ hàng đơn giản */}
      {cart.length > 0 && (
        <div
          style={{
            marginTop: 40,
            borderTop: "1px solid #ddd",
            paddingTop: 20,
          }}
        >
          <h3>Giỏ hàng của bạn</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.ID_PRODUCT_INSTANCE} style={{ marginBottom: 10 }}>
                <strong>{item.NAME_PRODUCTS}</strong> - Số lượng:{" "}
                {item.quantity} - Giá:{" "}
                {(item.PRICE_PRODUCTS * item.quantity).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </li>
            ))}
          </ul>
          <p>
            <strong>Tổng tiền: </strong>
            {cart
              .reduce(
                (acc, item) => acc + item.PRICE_PRODUCTS * item.quantity,
                0
              )
              .toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
