import React, { useEffect, useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import transportServiceFeesService from "../../services/transportServiceFees.service";
import TransportServiceFeesModal from "../modal/transportServiceFees-modal";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

const TransportServiceFees = () => {
  const [fees, setFees] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();

  const fetchFees = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await transportServiceFeesService.getFees({
      ID_COMPANY_SHIP: companyId,
    });
    setFees(data);
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleEdit = (fee) => {
    setSelectedFee(fee);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await transportServiceFeesService.deleteFee(id);
    fetchFees();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý phí dịch vụ vận chuyển
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedFee(null);
          setOpenModal(true);
        }}
      >
        Thêm phí dịch vụ
      </Button>

      <DynamicTable
        data={fees}
        columns={[
          { key: "SERVICE_NAME", label: "Tên dịch vụ" },
          { key: "UNIT", label: "Đơn vị" },
          { key: "PRICE", label: "Giá" },
          { key: "NOTE", label: "Ghi chú" },
          { key: "STATUS", label: "Trạng thái" },
          { key: "CREATED_AT", label: "Ngày tạo" },
          { key: "UPDATED_AT", label: "Ngày cập nhật" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_FEE)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <TransportServiceFeesModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        fee={selectedFee}
        onSuccess={fetchFees}
      />
    </Box>
  );
};

export default TransportServiceFees;
