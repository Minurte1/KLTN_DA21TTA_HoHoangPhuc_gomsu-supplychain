import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import companyServices from "../../services/companies-service";
import CompanyFormModal from "../modal/companies-modal";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();
  const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
  const fetchCompanies = async () => {
    const data = await companyServices.getCompanies(companyId);
    setCompanies(data.DT || []);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await companyServices.deleteCompany(id);
    fetchCompanies();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Công Ty
      </Typography>
      {!companyId && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mb: 2 }}
          onClick={() => {
            setSelectedCompany(null);
            setOpenModal(true);
          }}
        >
          Thêm Công Ty
        </Button>
      )}

      <DynamicTable
        data={companies}
        columns={[
          {
            key: "AVATAR",
            label: "Logo",
            render: (value) => (
              <>
                <img
                  src={
                    value ||
                    "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                  }
                  alt="Avatar"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    // Nếu lỗi thì thay thế src bằng null để không lặp vô hạn
                    e.target.onerror = null;
                    // Hiển thị đường dẫn hình ảnh (fallback text)
                    e.target.replaceWith(
                      document.createTextNode(value || "Không có hình ảnh")
                    );
                  }}
                />
              </>
            ),
          },
          {
            key: "BACKGROUND",
            label: "Ảnh bìa",
            render: (value) => (
              <img
                src={value}
                alt="Product"
                style={{
                  width: 100,
                  height: 60,
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            ),
          },
          { key: "NAME_COMPANY", label: "Tên công ty" },
          // { key: "TYPE_COMPANY", label: "Loại công ty" },
          { key: "DIA_CHI_Provinces", label: "Tỉnh/Thành phố" },
          { key: "DIA_CHI_Districts", label: "Quận/Huyện" },
          { key: "DIA_CHI_Wards", label: "Phường/Xã" },
          { key: "DIA_CHI_STREETNAME", label: "Tên đường" },
          { key: "PHONE", label: "Số điện thoại" },
          { key: "EMAIL", label: "Email" },
          { key: "STATUS", label: "Trạng thái" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_COMPANY)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <CompanyFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          fetchCompanies();
          setSelectedCompany(null);
        }}
        company={selectedCompany}
        onSuccess={() => {
          setOpenModal(false);
          fetchCompanies();
          setSelectedCompany(null);
        }}
      />
    </Box>
  );
};

export default Company;
