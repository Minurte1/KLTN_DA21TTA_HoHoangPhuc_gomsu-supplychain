import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import roleServices from "../../services/role-service";
import RoleFormModal from "../modal/role-modal";

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const fetchRoles = async () => {
    const data = await roleServices.getRoles();
    setRoles(data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

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
        Quản lý Role
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
        Thêm Role
      </Button>

      <DynamicTable
        data={roles}
        columns={[
          { key: "NAME_ROLE", label: "Tên quyền" },
          { key: "CODE_NAME", label: "Mã quyền" },
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
