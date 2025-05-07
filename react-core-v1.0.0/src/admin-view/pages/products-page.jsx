import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";

import productServices from "../../services/productServices";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    const data = await productServices.getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await productServices.deleteProduct(id);
    fetchProducts();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Sản Phẩm
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedProduct(null);
          setOpenModal(true);
        }}
      >
        Thêm Sản Phẩm
      </Button>

      <DynamicTable
        data={products}
        columns={[
          { key: "NAME_PRODUCTS", label: "Tên sản phẩm" },
          { key: "DESCRIPTION_PRODUCTS", label: "Mô tả" },
          { key: "PRICE_PRODUCTS", label: "Giá" },
          { key: "STOCK_PRODUCTS", label: "Số lượng tồn kho" },
          {
            key: "IMAGE_URL_PRODUCTS",
            label: "Ảnh sản phẩm",
            render: (value) => (
              <img
                src={value}
                alt="Product"
                style={{ width: 50, height: 50 }}
              />
            ),
          },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_PRODUCT)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      {/* <ProductFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        product={selectedProduct}
        onSuccess={fetchProducts}
      /> */}
    </Box>
  );
};

export default Product;
