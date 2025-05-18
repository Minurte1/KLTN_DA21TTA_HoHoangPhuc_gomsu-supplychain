import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import UsersFormModal from "../modal/users-modal";
// import userServices from "../../services/user-service";
// import UserFormModal from "../modal/user-modal";

const User = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    //  const data = await userServices.getUsers();
    // setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    // await userServices.deleteUser(id);
    fetchUsers();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Người Dùng
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedUser(null);
          setOpenModal(true);
        }}
      >
        Thêm Người Dùng
      </Button>

      <DynamicTable
        data={users}
        columns={[
          { key: "HO_TEN", label: "Họ tên" },
          { key: "EMAIL", label: "Email" },
          { key: "SO_DIEN_THOAI", label: "Số điện thoại" },
          { key: "DIA_CHI_Provinces", label: "Tỉnh/Thành phố" },
          { key: "DIA_CHI_Districts", label: "Quận/Huyện" },
          { key: "DIA_CHI_Wards", label: "Phường/Xã" },
          { key: "DIA_CHI_STREETNAME", label: "Tên đường" },
          { key: "TRANG_THAI_USER", label: "Trạng thái" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_USERS)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <UsersFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </Box>
  );
};

export default User;
