import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import { getUserById, updateUserById } from "../../services/userAccountService";
import { toast } from "react-toastify";
import { enqueueSnackbar } from "notistack";

const Input = styled("input")({
  display: "none",
});

const ProfileUsers = () => {
  const { userInfo } = ReduxExportUseAuthState();
  const [infoUser, setInfoUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // Lưu file ảnh
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (userInfo) {
      getInfoUsers(userInfo.ID_USERS);
    }
  }, [userInfo]);

  const getInfoUsers = async (ID_USERS) => {
    const response = await getUserById(ID_USERS);
    setInfoUser(response);
    setFormData(response);
    if (response?.AVATAR) {
      setAvatarPreview(response.AVATAR);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // Lưu file để upload
      setAvatarPreview(URL.createObjectURL(file)); // Preview ảnh
    }
  };

  const handleUpdateUsers = async () => {
    // Kiểm tra đổi mật khẩu
    if (newPassword || oldPassword) {
      if (!oldPassword || !newPassword) {
        enqueueSnackbar("Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới! ", {
          variant: "info",
        });
        return;
      }
    }
    try {
      const res = await updateUserById(
        userInfo?.ID_USERS,
        {
          ...formData,
          oldPassword: oldPassword || undefined,
          newPassword: newPassword || undefined,
        },
        avatarFile
      );

      if (res.EC === 1) {
        enqueueSnackbar(res.EM, { variant: "success" });
      } else {
        enqueueSnackbar(res.EM, { variant: "error" });
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
    }
  };

  if (!infoUser) return null;

  return (
    <Card sx={{ maxWidth: 900, margin: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Grid container spacing={3}>
          {/* Avatar */}
          <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
            <Avatar
              alt={formData.HO_TEN}
              src={avatarPreview}
              sx={{ width: 120, height: 120, margin: "auto" }}
            />
            {editMode && (
              <label htmlFor="avatar-upload">
                <Input
                  accept="image/*"
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <Button variant="outlined" component="span" sx={{ mt: 1 }}>
                  Upload
                </Button>
              </label>
            )}
          </Grid>

          {/* Thông tin cơ bản */}
          <Grid item xs={12} md={9}>
            <Typography variant="h6" gutterBottom>
              Thông tin cá nhân
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Họ tên"
                  name="HO_TEN"
                  fullWidth
                  value={formData.HO_TEN || ""}
                  onChange={handleChange}
                  InputProps={{ readOnly: !editMode }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="EMAIL"
                  fullWidth
                  value={formData.EMAIL || ""}
                  onChange={handleChange}
                  InputProps={{ readOnly: !editMode }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Số điện thoại"
                  name="SO_DIEN_THOAI"
                  fullWidth
                  value={formData.SO_DIEN_THOAI || ""}
                  onChange={handleChange}
                  InputProps={{ readOnly: !editMode }}
                />
              </Grid>{" "}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mật khẩu cũ"
                  type="password"
                  fullWidth
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  InputProps={{ readOnly: !editMode }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mật khẩu mới"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{ readOnly: !editMode }}
                />
              </Grid>
            </Grid>

            {/* Nút Edit / Save */}
            <Button
              variant="contained"
              color={editMode ? "success" : "primary"}
              sx={{ mt: 2 }}
              onClick={() => {
                if (editMode) {
                  handleUpdateUsers();
                }
                setEditMode(!editMode);
              }}
            >
              {editMode ? "Lưu" : "Chỉnh sửa"}
            </Button>
          </Grid>
        </Grid>

        {/* Thông tin công ty */}
        {infoUser.companyInfo && (
          <>
            {infoUser.companyInfo.NAME_COMPANY && (
              <>
                {" "}
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Thông tin công ty
                </Typography>
                <Typography>
                  <strong>Tên công ty:</strong>{" "}
                  {infoUser.companyInfo.NAME_COMPANY}
                </Typography>{" "}
              </>
            )}

            {infoUser.companyInfo.NAME_COMPANY_TYPE && (
              <Typography>
                <strong>Loại hình:</strong>{" "}
                {infoUser.companyInfo.NAME_COMPANY_TYPE}
              </Typography>
            )}

            {infoUser.companyInfo.ADDRESS && (
              <Typography>
                <strong>Địa chỉ:</strong> {infoUser.companyInfo.ADDRESS}
              </Typography>
            )}

            {infoUser.companyInfo.EMAIL && (
              <Typography>
                <strong>Email:</strong> {infoUser.companyInfo.EMAIL}
              </Typography>
            )}

            {infoUser.companyInfo.PHONE && (
              <Typography>
                <strong>Điện thoại:</strong> {infoUser.companyInfo.PHONE}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileUsers;
