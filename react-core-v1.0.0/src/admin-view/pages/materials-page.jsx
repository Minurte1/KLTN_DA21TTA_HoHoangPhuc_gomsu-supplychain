import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import materialServices from "../../services/materialServices";
import MaterialsFormModal from "../modal/materials-modal";

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const fetchMaterials = async () => {
    const data = await materialServices.getMaterials();
    setMaterials(data);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await materialServices.deleteMaterial(id);
    fetchMaterials();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Vật Liệu
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedMaterial(null);
          setOpenModal(true);
        }}
      >
        Thêm Vật Liệu
      </Button>

      <DynamicTable
        data={materials}
        columns={[
          { key: "NAME_MATERIAL_TYPES", label: "Tên loại vật liệu" },
          { key: "NAME_COMPANY", label: "Tên công ty" },
          { key: "NAME_", label: "Tên vật liệu" },
          { key: "UNIT_", label: "Đơn vị" },
          { key: "QUANTITY", label: "Số lượng " },
          { key: "COST_PER_UNIT_", label: "Giá mỗi đơn vị" },
          { key: "ORIGIN", label: "Nguồn gốc" },
          { key: "STATUS", label: "Trạng thái" },
          { key: "EXPIRY_DATE", label: "Ngày hết hạn" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_MATERIALS_)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <MaterialsFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        material={selectedMaterial}
        onSuccess={fetchMaterials}
      />
    </Box>
  );
};

export default Material;
