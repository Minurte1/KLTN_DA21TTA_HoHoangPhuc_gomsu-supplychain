import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import materialServices from "../../services/materialServices";
import MaterialsFormModal from "../modal/materials-modal";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MaterialsOrdersModal from "../modal/material-order.jsx/MaterialsOrdersModal";
import MaterialsOrderViewModal from "../modal/material-order.jsx/MaterialsOrderViewModal";

const MaterialOrderMaster = () => {
  const [materials, setMaterials] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();

  const fetchMaterials = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await materialServices.getMaterials({
      STATUS: "ACTIVE",
    });
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
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [openViewOrdersModal, setOpenViewOrdersModal] = useState(false);

  const handleOpenOrderModal = (material) => {
    setSelectedMaterial(material);
    setOpenOrderModal(true);
  };

  const handleViewOrders = (material) => {
    setSelectedMaterial(material);
    setOpenViewOrdersModal(true);
  };
  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Buôn bán vật liệu giữa các công ty
      </Typography>

      <DynamicTable
        data={materials}
        columns={[
          { key: "NAME_MATERIAL_TYPES", label: "Tên loại vật liệu" },
          { key: "NAME_COMPANY", label: "Tên công ty" },
          { key: "NAME_", label: "Tên vật liệu" },
          { key: "UNIT_", label: "Đơn vị" },
          { key: "QUANTITY", label: "Số lượng hiện có" },
          { key: "COST_PER_UNIT_", label: "Giá mỗi đơn vị" },
          { key: "ORIGIN", label: "Nguồn gốc" },
          { key: "STATUS", label: "Trạng thái" },

          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => {
              const isSameCompany =
                userInfo?.companyInfo?.ID_COMPANY === row.ID_COMPANY;

              return (
                <>
                  {isSameCompany ? (
                    <>
                      <IconButton onClick={() => handleViewOrders(row)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(row.ID_MATERIALS_)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  ) : (
                    // Nếu là công ty khác, có thể đặt mua
                    <IconButton onClick={() => handleOpenOrderModal(row)}>
                      <ShoppingCartIcon />
                    </IconButton>
                  )}
                </>
              );
            },
          },
        ]}
      />

      {/* Modal mua vật liệu */}
      <MaterialsOrdersModal
        open={openOrderModal}
        onClose={() => setOpenOrderModal(false)}
        material={selectedMaterial}
      />

      <MaterialsOrderViewModal
        open={openViewOrdersModal}
        onClose={() => setOpenViewOrdersModal(false)}
        material={selectedMaterial}
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

export default MaterialOrderMaster;
