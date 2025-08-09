import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";

import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import productionStepServices from "../../services/productionStepServices";
import ProductionStepsFormModal from "../modal/productionStep-modal";

const ProductionSteps = () => {
  const [steps, setSteps] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();

  const fetchSteps = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await productionStepServices.getProductionSteps({
      ID_COMPANY: companyId,
    });
    setSteps(data);
  };

  useEffect(() => {
    fetchSteps();
  }, [userInfo]);

  const handleEdit = (step) => {
    setSelectedStep(step);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await productionStepServices.deleteProductionStep(id);
    fetchSteps();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Công Đoạn Sản Xuất
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedStep(null);
          setOpenModal(true);
        }}
      >
        Thêm Công Đoạn
      </Button>

      <DynamicTable
        data={steps}
        columns={[
          { key: "STEP_NAME_PRODUCTION_STEPS", label: "Tên công đoạn" },
          { key: "START_TIME_PRODUCTION_STEPS", label: "Thời gian bắt đầu" },
          { key: "END_TIME_PRODUCTION_STEPS", label: "Thời gian kết thúc" },
          { key: "STATUS_PRODUCTION_STEPS", label: "Trạng thái" },
          { key: "ID_PRODUCTION_PLANS", label: "ID kế hoạch sản xuất" },
          { key: "ID_USERS", label: "ID người dùng" },
          { key: "ID_EQUIPMENT", label: "ID thiết bị" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(row.ID_PRODUCTION_STEPS_)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <ProductionStepsFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        productionStep={selectedStep}
        onSuccess={fetchSteps}
      />
    </Box>
  );
};

export default ProductionSteps;
