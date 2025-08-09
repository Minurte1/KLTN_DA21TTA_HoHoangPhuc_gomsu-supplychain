import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";

import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import productionPlanServices from "../../services/productionPlanServices";
import ProductionPlansFormModal from "../modal/productionPlans-modal";

const ProductionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();

  const fetchPlans = async () => {
    const ID_COMPANY = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await productionPlanServices.getProductionPlans(ID_COMPANY);
    setPlans(data);
  };

  useEffect(() => {
    fetchPlans();
  }, [userInfo]);

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await productionPlanServices.deleteProductionPlan(id);
    fetchPlans();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Kế hoạch Sản xuất
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedPlan(null);
          setOpenModal(true);
        }}
      >
        Thêm Kế hoạch Sản xuất
      </Button>

      <DynamicTable
        data={plans}
        subStatus={true}
        keyStatus={"productionPlans"}
        columns={[
          { key: "NAME_PRODUCTION_PLAN", label: "Tên kế hoạch" },
          { key: "ID_PRODUCT", label: "ID Sản phẩm" },
          { key: "ID_USERS", label: "ID Người dùng" },
          {
            key: "PLANNED_START_PRODUCTION_PLANS",
            label: "Ngày bắt đầu dự kiến",
          },
          {
            key: "PLANNED_END_PRODUCTION_PLANS",
            label: "Ngày kết thúc dự kiến",
          },
          {
            key: "ACTUAL_START_PRODUCTION_PLANS",
            label: "Ngày bắt đầu thực tế",
          },
          {
            key: "ACTUAL_END_PRODUCTION_PLANS",
            label: "Ngày kết thúc thực tế",
          },
          { key: "STATUS_PRODUCTION_PLANS", label: "Trạng thái" },
          { key: "NOTE_PRODUCTION_PLANS", label: "Ghi chú" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(row.ID_PRODUCTION_PLANS)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <ProductionPlansFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        productionPlan={selectedPlan}
        onSuccess={fetchPlans}
      />
    </Box>
  );
};

export default ProductionPlans;
