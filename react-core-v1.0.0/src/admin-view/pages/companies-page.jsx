import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import companyServices from "../../services/companies-service";

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fetchCompanies = async () => {
    const data = await companyServices.getCompanies();
    setCompanies(data);
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

      <DynamicTable
        data={companies}
        columns={[
          { key: "NAME_COMPANY", label: "Tên công ty" },
          { key: "TYPE_COMPANY", label: "Loại công ty" },
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

      {/* <CompanyFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        company={selectedCompany}
        onSuccess={fetchCompanies}
      /> */}
    </Box>
  );
};

export default Company;
