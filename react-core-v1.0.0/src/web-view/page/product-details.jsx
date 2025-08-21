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
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import productInstancesServices from "../../services/product_instancesServices";
import cartServices from "../../services/cartServices";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import ProductList from "../../components/productList";

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
    fetchProductInstances();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const stylePadding = {
    marginTop: "20px",
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: "8px",
    padding: "16px 0px",
  };

  // Hàm lấy danh sách product instances theo company
  const fetchProductInstances = async () => {
    const data = await productInstancesServices.getProductInstancesPublic({
      LIMIT: 1000000000,
      STATUS: "AVAILABLE",
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
  if (!product) return <Typography>Không tìm thấy sản phẩm</Typography>;

  return (
    <>
      <div style={stylePadding}>
        <Box
          sx={{
            maxWidth: 1000,
            margin: "20px auto",
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Grid container>
            {/* Hình ảnh */}
            <Grid item xs={12} md={5}>
              <CardMedia
                component="img"
                alt={product.NAME_PRODUCTS}
                image={product.IMAGE_URL_PRODUCTS}
                sx={{
                  objectFit: "contain",
                  height: { xs: 250, md: 400 },
                  p: 2,
                  borderRadius: 12,
                }}
              />
            </Grid>
            {/* Nội dung */}
            <Grid item xs={12} md={7}>
              <CardContent>
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
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Công ty: {product.NAME_COMPANY}
                </Typography>

                <Divider sx={{ my: 2 }} />

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
                      color="primary"
                      onClick={handleAddToCart}
                      sx={{ px: 3, py: 1.2, borderRadius: 2 }}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>{" "}
          </Grid>{" "}
        </Box>

        <ProductList products={productInstances} rows={20} />
      </div>
    </>
  );
};

export default ProductDetails;
