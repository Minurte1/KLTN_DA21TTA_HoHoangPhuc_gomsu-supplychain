import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Tabs,
  Tab,
  Button,
  Modal,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect } from "react";
import roleServices from "../../../services/role-service";
import { permissionService } from "../../../services/listPermisstion-service";

// Component PermissionManager giờ là Modal
const PermissionManagerModal = ({
  open,
  onClose,
  initialPermissions,
  selectInitialPermissions,
  roleName,
  handleSetListPermissionsForm,
}) => {
  // Định nghĩa mapping từ tiếng Anh sang tiếng Việt
  const permissionTranslations = {
    // Router translations
    dashboard: "Bảng điều khiển",
    role: "Vai trò",
    user: "Người dùng",
    company: "Công ty",
    company_type: "Loại công ty",
    product: "Sản phẩm",
    category: "Danh mục",
    material: "Nguyên vật liệu",
    material_type: "Loại nguyên vật liệu",
    material_order: "Đơn đặt nguyên vật liệu",
    supplier: "Nhà cung cấp",
    inventory: "Kho hàng",
    order: "Đơn hàng",
    order_item: "Chi tiết đơn hàng",
    production_plan: "Kế hoạch sản xuất",
    production_step: "Bước sản xuất",
    production_material: "Nguyên liệu sản xuất",
    quality_control: "Kiểm tra chất lượng",
    transport_order: "Đơn vận chuyển",
    cart: "Giỏ hàng",
  };

  const [selectedRole, setSelectedRole] = useState(0);
  const [permissions, setPermissions] = useState([]);

  const [translatedPermissions, setTranslatedPermissions] = useState([]);
  const [rolesData, setRoleData] = useState({});
  // Xử lý khi thay đổi role
  const handleRoleChange = (event, newValue) => {
    setSelectedRole(newValue);
    setPermissions(rolesData[newValue].permissions);
  };

  useEffect(() => {
    setTranslatedPermissions([]);
    fetchListBasePermission();
    // Chuyển đổi dữ liệu để hiển thị

    setRoleData({ name: roleName, permissions: permissions });
  }, [open]);

  const fetchListBasePermission = async () => {
    try {
      const response = await permissionService.getPermission();
      console.log("response", response);
      // Check if response is valid and contains the expected data
      if (response && Array.isArray(response)) {
        // console.log("oke");
        setPermissions(response);
        // setTranslatedPermissions(translatedPermissionsL);
      } else {
        console.error("Invalid response structure", response);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Xử lý khi thay đổi quyền
  const handlePermissionChange = (routerIndex, actionIndex) => {
    const updatedTranslatedPermissions = [...translatedPermissions];

    updatedTranslatedPermissions[routerIndex].actions[actionIndex].checked =
      !updatedTranslatedPermissions[routerIndex].actions[actionIndex].checked;

    setTranslatedPermissions(updatedTranslatedPermissions);
  };

  useEffect(() => {
    if (
      Array.isArray(permissions) &&
      permissions.length > 0
      //   &&
      //   Array.isArray(initialPermissions) &&
      //   initialPermissions.length > 0
    ) {
      let translated = convertPermissionsToVietnamese(permissions).map(
        (perm) => ({
          ...perm,
          actions: perm.actions.map((action) => ({
            ...action,
            checked: false,
          })),
        })
      );
      if (Array.isArray(initialPermissions) && initialPermissions.length > 0) {
        translated = translated.map((perm) => {
          const initialPerm = initialPermissions.find(
            (ip) => ip.router.toLowerCase() === perm.routerGoc.toLowerCase()
          );
          if (initialPerm) {
            return {
              ...perm,
              actions: perm.actions.map((action) => ({
                ...action,
                checked: initialPerm.actions.includes(action.original),
              })),
            };
          }
          return perm;
        });
      }

      setTranslatedPermissions(translated);
    }
  }, [permissions, initialPermissions]);

  // Hàm convert tên router sang tiếng Việt
  const reverseRouterName = (translatedName) => {
    const routerTranslations = {
      role: "Quản lý phân quyền",
    };

    const entry = Object.entries(routerTranslations).find(
      ([key, value]) => value === translatedName
    );

    return entry ? entry[0] : translatedName;
  };
  const convertRouterName = (routerName) => {
    const routerTranslations = {
      role: "Quản lý phân quyền",
    };

    return routerTranslations[routerName] || routerName;
  };
  const syncPermissionsBeforeSubmit = () => {
    const syncedPermissions = translatedPermissions
      .map((perm) => {
        const checkedActions = perm.actions
          .filter((action) => action.checked)
          .map((action) => action.original);

        if (checkedActions.length === 0) return null; // bỏ nếu không có quyền nào được chọn

        return {
          router: reverseRouterName(perm.router), // hoặc perm.routerGoc nếu bạn dùng cách giữ gốc
          actions: checkedActions,
        };
      })
      .filter(Boolean); // loại bỏ các phần tử null

    return syncedPermissions;
  };

  const convertPermissionsToVietnamese = (permissionsList) => {
    return permissionsList.map((permission) => ({
      router: convertRouterName(permission.router), // Dùng để hiển thị
      routerGoc: permission.router, // Dùng để lưu ngược về backend
      actions: permission.actions.map((action) => ({
        original: action,
        translated: permissionTranslations[action] || action,
        checked: false,
      })),
    }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 1400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Quản lý phân quyền
        </Typography>

        {/* Tabs cho các roles */}
        <Tabs
          value={selectedRole}
          onChange={handleRoleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          {Array.isArray(rolesData) && rolesData.length > 0 ? (
            rolesData.map((role, index) => (
              <Tab key={role.name} label={role.name} value={index} />
            ))
          ) : (
            <Tab
              disabled
              label={`${roleName || `Không có vai trò`}`}
              value={0}
            />
          )}
        </Tabs>

        {/* Bảng phân quyền */}
        <TableContainer
          component={Paper}
          sx={{
            mt: 2,
            maxHeight: 450,

            overflowY: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên router</TableCell>
                <TableCell>Quyền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {translatedPermissions.map((perm, routerIndex) => (
                <TableRow key={perm.router}>
                  <TableCell>{perm.router}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      {perm.actions.map((action, actionIndex) => (
                        <Box
                          key={action.original}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Checkbox
                            checked={action.checked || false}
                            onChange={() =>
                              handlePermissionChange(routerIndex, actionIndex)
                            }
                          />
                          <Typography variant="body2">
                            {action.translated}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Nút lưu và đóng */}
        <Box
          sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <button
            className="btn btn-primary admin-btn"
            onClick={() => {
              const finalPermissions = syncPermissionsBeforeSubmit();
              // console.log("🚀 permissions to submit:", finalPermissions);
              handleSetListPermissionsForm(finalPermissions);
              onClose();
            }}
          >
            <i className="fa-solid fa-floppy-disk mr-5"></i> Lưu thay đổi
          </button>
          <button className="btn btn-danger admin-btn" onClick={onClose}>
            <i className="fa-solid fa-ban mr-5"></i> Huỷ
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PermissionManagerModal;
