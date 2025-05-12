import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";

// import CompanyTypeFormModal from "../modal/company-type-modal";
import companyTypeServices from "../../services/company_types-service";
import CompanyTypeFormModal from "../modal/company_types-modal";

const CompanyType = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCompanyType, setSelectedCompanyType] = useState(null);
  const [companyTypes, setCompanyTypes] = useState([]);
  const fetchCompanyTypes = async () => {
    const data = await companyTypeServices.getCompanyTypes();
    setCompanyTypes(data);
  };

  useEffect(() => {
    fetchCompanyTypes();
  }, []);

  const handleEdit = (companyType) => {
    setSelectedCompanyType(companyType);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await companyTypeServices.deleteCompanyType(id);
    fetchCompanyTypes();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Loại Công Ty
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedCompanyType(null);
          setOpenModal(true);
        }}
      >
        Thêm Loại Công Ty
      </Button>

      <DynamicTable
        data={companyTypes}
        columns={[
          { key: "NAME_COMPANY_TYPE", label: "Tên loại công ty" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_COMPANY_TYPE)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <CompanyTypeFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        companyType={selectedCompanyType}
        onSuccess={fetchCompanyTypes}
      />
    </Box>
  );
};

export default CompanyType;
