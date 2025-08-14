import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import roleServices from "../../services/role-service";
import RoleFormModal from "../modal/role-modal";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();

  const fetchRoles = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await roleServices.getRoles(companyId);
    setRoles(data.DT); // hoặc data nếu bạn không trả về theo { EM, EC, DT }
  };

  useEffect(() => {
    fetchRoles();
  }, [userInfo]);

  const handleEdit = (role) => {
    setSelectedRole(role);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await roleServices.deleteRole(id);
    fetchRoles();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý phân quyền
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedRole(null);
          setOpenModal(true);
        }}
      >
        Thêm phân quyền
      </Button>

      <DynamicTable
        data={roles}
        columns={[
          { key: "ID_COMPANY", label: "Mã Công Ty" },
          { key: "CODE_NAME", label: "Mã quyền" },
          { key: "NAME_ROLE", label: "Tên quyền" },
          { key: "DESCRIPTION", label: "Mô tả" },
          // {
          //   key: "LIST_PERMISSION",
          //   label: "Danh sách quyền",
          //   render: (value) => value.join(", "),
          // },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_ROLE)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <RoleFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        role={selectedRole}
        onSuccess={fetchRoles}
      />
    </Box>
  );
};

export default Role;
