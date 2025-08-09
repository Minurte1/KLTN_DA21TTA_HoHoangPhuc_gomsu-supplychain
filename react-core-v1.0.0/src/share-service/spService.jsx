const spService = {
  /**
   * Parse chuỗi JSON nếu hợp lệ, nếu không thì trả về giá trị mặc định
   * @param {string} str - chuỗi cần parse
   * @param {*} defaultValue - giá trị trả về nếu không phải JSON hợp lệ
   * @returns {*}
   */
  parseJsonIfValid: (str, defaultValue = []) => {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === "object" && parsed !== null
        ? parsed
        : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  parsePermissionList: (permissionString) => {
    if (!permissionString || typeof permissionString !== "string") return [];

    try {
      // Trường hợp chuỗi có dấu nháy kép bao ngoài
      const cleaned = permissionString.trim();
      const parsed = JSON.parse(cleaned);

      // Nếu chuỗi đã được stringify 2 lần, parse lần nữa
      if (typeof parsed === "string") {
        return JSON.parse(parsed);
      }

      return parsed;
    } catch (error) {
      console.error("Lỗi parse LIST_PERMISION:", error);
      return [];
    }
  },

  createSlug: (str) => {
    return str
      .normalize("NFD") // Tách dấu khỏi ký tự gốc
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .replace(/đ/g, "d") // Thay đ -> d
      .replace(/Đ/g, "D") // Thay Đ -> D
      .toLowerCase() // Chuyển về chữ thường
      .trim() // Xóa khoảng trắng đầu/cuối
      .replace(/\s+/g, "-") // Thay khoảng trắng bằng -
      .replace(/[^a-z0-9\-]/g, "") // Loại bỏ ký tự đặc biệt
      .replace(/\-{2,}/g, "-") // Gộp nhiều dấu - thành 1
      .replace(/^-+|-+$/g, ""); // Xóa dấu - ở đầu/cuối
  },
  // mapStatusToVietnamese: (status, key) => {
  //   const statusMap = {
  //     // Trạng thái sản phẩm
  //     ACTIVE: "Đang bán",
  //     HIDDEN: "Đã ẩn",
  //     OUT: "Hết hàng",
  //     STOP: "Ngừng kinh doanh",
  //     PENDING: "Chờ duyệt",

  //     READY: "Sẵn sàng",

  //     // Trạng thái đơn hàng
  //     CONFIRMED: "Đã xác nhận",
  //     DELIVERING: "Đang giao",
  //     DELIVERED: "Đã giao",
  //     CANCELLED: "Đã huỷ",
  //     RETURNED: "Đã hoàn trả",
  //     SUCCESS: "Giao thành công",
  //     FAILED: "Giao thất bại",

  //     // Trạng thái mới thêm
  //     NEED_TO_SHIP: "Cần vận chuyển",
  //   };

  //   return statusMap[status] || status || "Không xác định";
  // },

  mapStatusToVietnamese: (status, key) => {
    const statusMaps = {
      product: {
        ACTIVE: "Đang bán",
        HIDDEN: "Đã ẩn",
        OUT: "Hết hàng",
        STOP: "Ngừng kinh doanh",
        PENDING: "Chờ duyệt",
        READY: "Sẵn sàng",
      },
      order: {
        CONFIRMED: "Đã xác nhận",
        DELIVERING: "Đang giao",
        DELIVERED: "Đã giao",
        CANCELLED: "Đã huỷ",
        RETURNED: "Đã hoàn trả",
        SUCCESS: "Giao thành công",
        FAILED: "Giao thất bại",
        NEED_TO_SHIP: "Cần vận chuyển",
      },
      equipment: {
        ACTIVE: "Hoạt động",
        INACTIVE: "Không hoạt động",
        MAINTENANCE: "Đang bảo trì",
        RETIRED: "Đã ngưng sử dụng",
      },
      productionPlans: {
        PLANNED: "Đã Lập Kế Hoạch",
        IN_PROGRESS: "Đang Tiến Hành",
        COMPLETED: "Đã Hoàn Thành",
        CANCELED: "Đã Hủy",
      },

      default: {
        ACTIVE: "Hoạt động",
        INACTIVE: "Không hoạt động",
        MAINTENANCE: "Đang bảo trì",
        RETIRED: "Đã ngưng sử dụng",
      },
    };

    // Nếu key ko truyền hoặc không có, sẽ dùng default (để giữ tương thích cũ)
    const map = key && statusMaps[key] ? statusMaps[key] : statusMaps.default;
    return map[status] || status || "Không xác định";
  },
};
export default spService;
