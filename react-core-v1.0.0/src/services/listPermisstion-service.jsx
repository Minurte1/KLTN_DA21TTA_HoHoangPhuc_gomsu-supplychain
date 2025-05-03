import axiosInstance from "../authentication/axiosInstance";
const API = `${process.env.REACT_APP_URL_SERVER}/api/permissions/base-list`;
export const permissionService = {
  /**
   * Kiểm tra xem có quyền thực hiện hành động trên router không
   * @param {string} router - Tên router (ví dụ: "account")
   * @param {string} action - Hành động (ví dụ: "GET_ACCOUNT")
   * @param {Object} listPermissions - Đối tượng chứa role và listPermistions
   * @param {Object} [options] - Tùy chọn bổ sung (ví dụ: kiểm tra quyền theo ngữ cảnh)
   * @returns {boolean} - True nếu có quyền, false nếu không
   */
  hasPermissionForRouter(router, action, listPermissions = {}, options = {}) {
    const role = listPermissions?.value?.role;

    // Nếu là SYSTEM thì luôn có quyền
    if (listPermissions?.value === "SYSTEM") return true;

    if (!Array.isArray(listPermissions?.value?.listPermistions)) {
      console.error("listPermissions must be an array");
      return false;
    }

    const found = listPermissions.value.listPermistions.find(
      (item) => item.router === router
    );

    if (!found || !found.actions) return false;

    let hasAction = found.actions.includes(action);

    if (options.context) {
      hasAction = hasAction && found.context?.includes(options.context);
    }

    return hasAction;
  },

  /**
   * Lấy tất cả hành động cho một router
   * @param {string} router
   * @param {Object} listPermissions - Đối tượng chứa role và listPermistions
   * @returns {Array} actions
   */
  getActionsForRouter(router, listPermissions = {}) {
    const role = listPermissions?.value?.role;

    // Nếu là SYSTEM thì trả về tất cả (mặc định là ["*"])
    if (role === "SYSTEM") return ["*"];

    if (!Array.isArray(listPermissions?.value?.listPermistions)) {
      console.error("listPermissions must be an array");
      return [];
    }

    const found = listPermissions.value.listPermistions.find(
      (item) => item.router === router
    );

    return found ? found.actions : [];
  },
  getPermission: async () => {
    const res = await axiosInstance.get(API);
    return res.data;
  },
};
