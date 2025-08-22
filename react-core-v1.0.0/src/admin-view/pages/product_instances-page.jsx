import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";

import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import productInstancesServices from "../../services/product_instancesServices";
import ProductsInstanceFormModal from "../modal/product_instances-modal";

const ProductInstances = () => {
  const [productInstances, setProductInstances] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProductInstance, setSelectedProductInstance] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();

  // Hàm lấy danh sách product instances theo company
  const fetchProductInstances = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await productInstancesServices.getProductInstances({
      ID_COMPANY: companyId,
    });
    setProductInstances(data);
  };

  useEffect(() => {
    fetchProductInstances();
  }, [userInfo]);

  const handleEdit = (productInstance) => {
    setSelectedProductInstance(productInstance);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await productInstancesServices.deleteProductInstance(id);
    fetchProductInstances();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Sản phẩm chi tiết
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedProductInstance(null);
          setOpenModal(true);
        }}
      >
        Thêm Sản phẩm
      </Button>

      <DynamicTable
        data={productInstances}
        keyStatus={"productInstanceStatus"}
        statusColumns={["STATUS"]}
        subStatus={true}
        columns={[
          { key: "UID", label: "UID" },
          { key: "SERIAL_CODE", label: "Mã Serial" },
          { key: "Danh mục", label: "NAME_CATEGORIES_" },
          { key: "NAME_PRODUCTS", label: "ID Sản phẩm" },
          {
            key: "IMAGE_URL_PRODUCTS",
            label: "Ảnh sản phẩm",
            render: (value) => (
              <img
                src={value}
                alt="Product"
                style={{ width: 80, height: 80, borderRadius: "8px" }}
              />
            ),
          },
          // { key: "ID_USERS", label: "Thông tin người chế tác" },
          { key: "NAME_PRODUCTION_PLAN", label: "Kế hoạch sản xuất" },
          { key: "DATE_CREATED", label: "Ngày tạo" },
          { key: "DESCRIPTION_PRODUCTS", label: "Mô tả sản phẩm" },
          { key: "STATUS", label: "Trạng thái" },
          { key: "ID_COMPANY", label: "ID Công ty" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(row.ID_PRODUCT_INSTANCE)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <ProductsInstanceFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        productInstance={selectedProductInstance}
        onSuccess={fetchProductInstances}
      />
    </Box>
  );
};

export default ProductInstances;
