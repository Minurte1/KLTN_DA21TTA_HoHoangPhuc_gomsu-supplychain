import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import inventoryServices from "../../services/inventory-service";
import InventoryFormModal from "../modal/inventory-modal";

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

  const fetchInventoryItems = async () => {
    const data = await inventoryServices.getInventoryItems();
    setInventoryItems(data);
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const handleEdit = (inventoryItem) => {
    setSelectedInventoryItem(inventoryItem);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await inventoryServices.deleteInventoryItem(id);
    fetchInventoryItems();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Kho Hàng
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedInventoryItem(null);
          setOpenModal(true);
        }}
      >
        Thêm Kho Hàng
      </Button>

      <DynamicTable
        data={inventoryItems}
        columns={[
          { key: "ID_MATERIALS_", label: "ID Vật Liệu" },
          { key: "QUANTITY_ORDER_ITEMS", label: "Số lượng đặt hàng" },
          { key: "LAST_UPDATED_", label: "Cập nhật lần cuối" },
          { key: "STORAGE_CONDITION", label: "Điều kiện bảo quản" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_INVENTORY_)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <InventoryFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        inventoryItem={selectedInventoryItem}
        onSuccess={fetchInventoryItems}
      />
    </Box>
  );
};

export default Inventory;
