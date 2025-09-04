import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Divider,
  CircularProgress,
  TextField,
  useTheme,
  Box,
  Tooltip,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import productInstancesServices from "../../services/product_instancesServices";
import cartServices from "../../services/cartServices";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import ProductList from "../../components/productList";
import Footer from "../../components/footer";
import {
  styleBackground,
  styleHeading,
  stylePadding,
} from "../../share-service/spStyle";
import NotFoundProduct from "../../share-view/component/NotFoundProduct";

const ProductDetails = () => {
  const { serialCode } = useParams();
  const [product, setProduct] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();
  const theme = useTheme(); // lấy theme MUI

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [productInstances, setProductInstances] = useState([]);

  useEffect(() => {
    if (!serialCode) return;
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await productInstancesServices.getProductInstancesPublic({
          STATUS: "AVAILABLE",
          SERIAL_CODE: serialCode,
          LIMIT: 1,
        });

        setProduct(data[0] || null);
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [serialCode]);

  const handleAddToCart = async () => {
    if (!userInfo)
      return enqueueSnackbar("Bạn cần đăng nhập!", { variant: "warning" });

    const userId = userInfo?.ID_USERS;

    try {
      await cartServices.createCart({
        ID_PRODUCT_INSTANCE: product.ID_PRODUCT_INSTANCE,
        ID_USERS: userId,
        ID_COMPANY: product.ID_COMPANY,
        QUANTITY: quantity,
        CREATED_AT_CART: new Date().toISOString(),
      });

      setCart([...cart, { ...product, quantity }]);
      enqueueSnackbar("Đã thêm vào giỏ hàng!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Lỗi khi thêm sản phẩm vào giỏ hàng.", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (product) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      fetchProductInstances();
    }
  }, [product]);

  // Hàm lấy danh sách product instances theo company
  const fetchProductInstances = async () => {
    const data = await productInstancesServices.getProductInstancesPublic({
      LIMIT: 1000000000,
      STATUS: "AVAILABLE",
      ID_CATEGORIES_: product ? product.ID_CATEGORIES_ : null,
    });

    setProductInstances(data);
  };

  if (loading)
    return (
      <Grid container justifyContent="center" mt={5}>
        <CircularProgress color="primary" />
      </Grid>
    );

  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <NotFoundProduct />;
  return (
    <>
      {" "}
      <div style={stylePadding}>
        {" "}
        <Box
          sx={{
            width: "100%",
            margin: "20px auto",
            borderRadius: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Grid container spacing={2} direction={{ xs: "column", md: "row" }}>
            {/* Hình ảnh sản phẩm */}
            <Grid item xs={12} md={5}>
              <CardMedia
                component="img"
                alt={product.NAME_PRODUCTS}
                image={product.IMAGE_URL_PRODUCTS}
                sx={{
                  objectFit: "contain",
                  height: { xs: 250, md: 400 },
                  borderRadius: 12,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
            </Grid>

            {/* Thông tin sản phẩm */}
            <Grid item xs={12} md={7}>
              <CardContent sx={{ padding: { xs: 2, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {product.NAME_PRODUCTS}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {product.DESCRIPTION_PRODUCTS}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
                  gutterBottom
                >
                  Giá:{" "}
                  {product.PRICE_PRODUCTS?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Danh mục: {product.NAME_CATEGORIES_}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mã sản phẩm: {product.SERIAL_CODE}
                </Typography>

                {/* Logo công ty + tên */}
                <Divider sx={{ my: 2 }} />
                <Grid container alignItems="center" spacing={1}>
                  {product.AVATAR && (
                    <Grid item>
                      <Tooltip
                        title={product.NAME_COMPANY || "Tên công ty"}
                        arrow
                      >
                        <Box
                          component="img"
                          src={product.AVATAR}
                          alt={product.NAME_COMPANY || "Logo công ty"}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            border: "1px solid #e0e0e0",
                            objectFit: "cover",
                          }}
                        />
                      </Tooltip>
                    </Grid>
                  )}
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      Công ty: {product.NAME_COMPANY}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Số lượng + button */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <TextField
                      type="number"
                      size="small"
                      label="Số lượng"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Number(e.target.value)))
                      }
                      sx={{ width: 100 }}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() => handleAddToCart(quantity)}
                      disabled={product.QUANTITY < 1} // ✅ disable nếu số lượng < 1
                      sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: 5,
                        backgroundColor: "#8b5e3c",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#7a5230",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "#ccc", // màu khi disable
                          color: "#666",
                        },
                      }}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
          </Grid>
        </Box>
      </div>{" "}
      <div style={styleBackground}>
        <span style={styleHeading}>Sản phẩm cùng danh mục </span>
        <ProductList products={productInstances} rows={20} />{" "}
      </div>{" "}
      <div style={stylePadding}>
        {" "}
        <Footer />
      </div>
    </>
  );
};

export default ProductDetails;
