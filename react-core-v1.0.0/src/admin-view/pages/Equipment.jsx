import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import equipmentServices from "../../services/equipmentServices"; // bạn cần tạo service tương ứng
import EquipmentFormModal from "../modal/equipment-modal"; // modal form cho Equipment bạn cũng cần tạo
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

const Equipment = () => {
  const [equipments, setEquipments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();

  const fetchEquipments = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await equipmentServices.getEquipments({
      ID_COMPANY: companyId,
    });

    setEquipments(data);
  };

  useEffect(() => {
    fetchEquipments();
  }, [userInfo]);

  const handleEdit = (equipment) => {
    setSelectedEquipment(equipment);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await equipmentServices.deleteEquipment(id);
    fetchEquipments();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Thiết Bị
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedEquipment(null);
          setOpenModal(true);
        }}
      >
        Thêm Thiết Bị
      </Button>

      <DynamicTable
        data={equipments}
        keyStatus="equipment"
        subStatus={true}
        columns={[
          { key: "NAME_EQUIPMENT", label: "Tên thiết bị" },
          { key: "TYPE_EQUIPMENT", label: "Loại thiết bị" },
          { key: "STATUS", label: "Trạng thái" },
          { key: "LAST_MAINTENANCE", label: "Bảo trì lần cuối" },
          { key: "CREATED_AT", label: "Ngày tạo" },
          { key: "UPDATED_AT", label: "Ngày cập nhật" },
          { key: "NAME_COMPANY", label: "Tên công ty" }, // nếu bạn join bảng công ty để lấy tên
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_EQUIPMENT)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <EquipmentFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        equipment={selectedEquipment}
        onSuccess={fetchEquipments}
      />
    </Box>
  );
};

export default Equipment;
