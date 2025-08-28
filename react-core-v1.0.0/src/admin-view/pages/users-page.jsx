import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import UsersFormModal from "../modal/users-modal";
import { deleteUserById, getAllUsers } from "../../services/userAccountService";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
// import userServices from "../../services/user-service";
// import UserFormModal from "../modal/user-modal";

const User = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();

  const fetchUsers = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await getAllUsers(companyId);
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await deleteUserById(id);
    fetchUsers();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý nhân viên
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
        Thêm nhân viên
      </Button>

      <DynamicTable
        data={users}
        columns={[
          { key: "HO_TEN", label: "Họ tên" },
          {
            key: "AVATAR",
            label: "Logo",
            render: (value) => (
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
            ),
          },
          { key: "EMAIL", label: "Email" },
          { key: "SO_DIEN_THOAI", label: "Số điện thoại" },
          { key: "DIA_CHI_Provinces", label: "Tỉnh/Thành phố" },
          { key: "DIA_CHI_Districts", label: "Quận/Huyện" },
          { key: "DIA_CHI_Wards", label: "Phường/Xã" },
          // { key: "DIA_CHI_STREETNAME", label: "Tên đường" },
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
        onClose={() => {
          setOpenModal(false);
          fetchUsers();
        }}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </Box>
  );
};

export default User;
