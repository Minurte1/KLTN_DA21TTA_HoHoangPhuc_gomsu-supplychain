import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import materialTypeServices from "../../services/materialTypeServices";
import MaterialTypeFormModal from "../modal/material_types-modal";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

// import MaterialTypeFormModal from "../modal/material-type-modal";

const MaterialType = () => {
  const [materialTypes, setMaterialTypes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMaterialType, setSelectedMaterialType] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();

  const fetchMaterialTypes = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await materialTypeServices.getMaterialTypes(companyId);
    setMaterialTypes(data);
  };

  useEffect(() => {
    fetchMaterialTypes();
  }, []);

  const handleEdit = (materialType) => {
    setSelectedMaterialType(materialType);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await materialTypeServices.deleteMaterialType(id);
    fetchMaterialTypes();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Loại Vật Liệu
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedMaterialType(null);
          setOpenModal(true);
        }}
      >
        Thêm Loại Vật Liệu
      </Button>

      <DynamicTable
        data={materialTypes}
        columns={[
          { key: "NAME_COMPANY", label: "Tên công ty sở hữu" },
          { key: "NAME_MATERIAL_TYPES", label: "Tên loại vật liệu" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_MATERIAL_TYPES)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <MaterialTypeFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        materialType={selectedMaterialType}
        onSuccess={fetchMaterialTypes}
      />
    </Box>
  );
};

export default MaterialType;
