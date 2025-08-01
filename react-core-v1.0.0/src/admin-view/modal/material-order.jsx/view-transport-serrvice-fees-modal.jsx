import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const ViewTranSportServicesFeesModal = ({
  open,
  onClose,
  companies,
  onAdd,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Danh sách công ty vận chuyển cung cấp dịch vụ</DialogTitle>

      <DialogContent dividers>
        {companies?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Tên công ty</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Dịch vụ</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Đơn vị</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {companies.map((company) =>
                  company.transport_service_fees.map((fee, idx) => (
                    <TableRow key={`${company.ID_COMPANY}-${idx}`}>
                      <TableCell>{company.NAME_COMPANY}</TableCell>
                      <TableCell>
                        {company.DIA_CHI_STREETNAME}, {company.DIA_CHI_Wards},{" "}
                        {company.DIA_CHI_Districts}, {company.DIA_CHI_Provinces}
                      </TableCell>
                      <TableCell>{fee.SERVICE_NAME}</TableCell>
                      <TableCell>{fee.PRICE.toLocaleString()}đ</TableCell>
                      <TableCell>{fee.UNIT}</TableCell>
                      <TableCell>{fee.FEE_STATUS}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          startIcon={<AddIcon />}
                          onClick={() => onAdd(company)}
                        >
                          +
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Không có công ty vận chuyển nào.</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTranSportServicesFeesModal;
