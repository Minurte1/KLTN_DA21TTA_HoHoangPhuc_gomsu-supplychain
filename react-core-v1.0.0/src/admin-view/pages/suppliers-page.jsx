import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";

import supplierServices from "../../services/supplierServices";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const fetchSuppliers = async () => {
    const data = await supplierServices.getSuppliers();
    setSuppliers(data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await supplierServices.deleteSupplier(id);
    fetchSuppliers();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Nhà Cung Cấp
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedSupplier(null);
          setOpenModal(true);
        }}
      >
        Thêm Nhà Cung Cấp
      </Button>

      <DynamicTable
        data={suppliers}
        columns={[
          { key: "NAME_PRODUCTS", label: "Tên sản phẩm" },
          { key: "ADDRESS_SUPPLIERS", label: "Địa chỉ nhà cung cấp" },
          { key: "PHONE_SUPPLIERS", label: "Số điện thoại" },
          { key: "EMAIL_SUPPLIERS", label: "Email" },
          { key: "STATUS_SUPPLIERS", label: "Trạng thái" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_SUPPLIERS)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      {/* <SupplierFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        supplier={selectedSupplier}
        onSuccess={fetchSuppliers}
      /> */}
    </Box>
  );
};

export default Supplier;
