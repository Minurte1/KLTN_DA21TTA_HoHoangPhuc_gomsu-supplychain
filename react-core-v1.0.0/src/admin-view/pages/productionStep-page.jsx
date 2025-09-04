import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";

import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import productionStepServices from "../../services/productionStepServices";
import ProductionStepsFormModal from "../modal/productionStep-modal";
import spService from "../../share-service/spService";

const filterStepsByToday = (steps) => {
  const today = new Date();
  const isSameDay = (dateStr) => {
    const date = new Date(dateStr);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Lọc công đoạn bắt đầu hoặc kết thúc trong hôm nay
  const todaySteps = steps.filter(
    (step) =>
      isSameDay(step.START_TIME_PRODUCTION_STEPS) ||
      isSameDay(step.END_TIME_PRODUCTION_STEPS)
  );

  // Các công đoạn còn lại
  const previousSteps = steps.filter(
    (step) =>
      !(
        isSameDay(step.START_TIME_PRODUCTION_STEPS) ||
        isSameDay(step.END_TIME_PRODUCTION_STEPS)
      )
  );

  return { todaySteps, previousSteps };
};

const ProductionSteps = () => {
  const [steps, setSteps] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();
  // Kiểm tra quyền view role
  const canViewRole = spService.hasPermission(
    userInfo?.LIST_PERMISION,
    "role",
    "view"
  );
  const fetchSteps = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const userId = userInfo?.ID_USERS || null;

    const params = { ID_COMPANY: companyId };
    if (!canViewRole) {
      // Nếu không có quyền view role thì truyền userId
      params.ID_USERS = userId;
    }

    const data = await productionStepServices.getProductionSteps(params);
    setSteps(data);
  };

  useEffect(() => {
    fetchSteps();
  }, [userInfo]);

  // Lọc dữ liệu thành 2 loại
  const { todaySteps, previousSteps } = filterStepsByToday(steps);

  const columns = [
    { key: "STEP_NAME_PRODUCTION_STEPS", label: "Tên công đoạn" },
    {
      key: "START_TIME_PRODUCTION_STEPS",
      label: "Thời gian bắt đầu",
      render: (value) => spService.formatDateTime(value),
    },
    {
      key: "END_TIME_PRODUCTION_STEPS",
      label: "Thời gian kết thúc",
      render: (value) => spService.formatDateTime(value),
    },

    { key: "NAME_PRODUCTION_PLAN", label: "ID kế hoạch sản xuất" },
    { key: "USER_HO_TEN", label: "Người thực hiện" },
    { key: "NAME_EQUIPMENT", label: "ID thiết bị" },
    { key: "STATUS_PRODUCTION_STEPS", label: "Trạng thái" },
    {
      key: "actions",
      label: "Hành động",
      render: (_, row) => (
        <>
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.ID_PRODUCTION_STEPS_)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

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
      {canViewRole && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mb: 2, mt: 4 }}
          onClick={() => {
            setSelectedStep(null);
            setOpenModal(true);
          }}
        >
          Thêm Công Đoạn
        </Button>
      )}

      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Công Đoạn Sản Xuất - Hôm nay
      </Typography>
      <DynamicTable
        statusColumns={["STATUS_PRODUCTION_STEPS"]}
        data={todaySteps}
        columns={columns}
        keyStatus={"productionSteps"}
        subStatus={true}
      />
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Công Đoạn Sản Xuất - Trước đó
      </Typography>
      <DynamicTable
        statusColumns={["STATUS_PRODUCTION_STEPS"]}
        data={previousSteps}
        columns={columns}
        subStatus={true}
        keyStatus={"productionSteps"}
      />
      <ProductionStepsFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        productionStep={selectedStep}
        onSuccess={fetchSteps}
        canViewRole={canViewRole}
      />
    </Box>
  );
};

export default ProductionSteps;
