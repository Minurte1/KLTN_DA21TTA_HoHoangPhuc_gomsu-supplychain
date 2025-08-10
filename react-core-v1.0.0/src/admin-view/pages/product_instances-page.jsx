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
        Quản lý Sản phẩm (Product Instances)
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
        keyStatus={"product_instances"}
        subStatus={true}
        columns={[
          { key: "UID", label: "UID" },
          { key: "SERIAL_CODE", label: "Mã Serial" },
          { key: "ID_PRODUCT", label: "ID Sản phẩm" },
          { key: "ID_USERS", label: "ID Người dùng" },
          { key: "ID_PRODUCTION_PLANS", label: "ID Kế hoạch sản xuất" },
          { key: "DATE_CREATED", label: "Ngày tạo" },
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
