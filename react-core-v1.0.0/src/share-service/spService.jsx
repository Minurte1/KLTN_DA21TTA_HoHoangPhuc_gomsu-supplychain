import CryptoJS from "crypto-js";
import { enqueueSnackbar } from "notistack";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || "my-secret-key";

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
        ACTIVE: {
          label: "Đang bán",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },

        HIDDEN: {
          label: "Đã ẩn",
          color: "#41464b",
          bgColor: "#e2e3e5",
          borderColor: "#d3d6d8",
        },
        OUT: {
          label: "Hết hàng",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
        STOP: {
          label: "Ngừng kinh doanh",
          color: "#664d03",
          bgColor: "#fff3cd",
          borderColor: "#ffecb5",
        },
        PENDING: {
          label: "Chờ duyệt",
          color: "#055160",
          bgColor: "#cff4fc",
          borderColor: "#b6effb",
        },
        READY: {
          label: "Sẵn sàng",
          color: "#084298",
          bgColor: "#cfe2ff",
          borderColor: "#b6d4fe",
        },
      },
      materials: {
        ACTIVE: {
          label: "Đang bán",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },

        HIDDEN: {
          label: "Đã ẩn",
          color: "#41464b",
          bgColor: "#e2e3e5",
          borderColor: "#d3d6d8",
        },
        OUT: {
          label: "Hết hàng",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
        STOP: {
          label: "Ngừng hoạt động",
          color: "#664d03",
          bgColor: "#fff3cd",
          borderColor: "#ffecb5",
        },
        PENDING: {
          label: "Chờ duyệt",
          color: "#055160",
          bgColor: "#cff4fc",
          borderColor: "#b6effb",
        },
        READY: {
          label: "Sẵn sàng",
          color: "#084298",
          bgColor: "#cfe2ff",
          borderColor: "#b6d4fe",
        },
      },
      order: {
        PAID: {
          label: "Đã thanh toán",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },
        CONFIRMED: {
          label: "Đã xác nhận",
          color: "#084298",
          bgColor: "#cfe2ff",
          borderColor: "#b6d4fe",
        },
        DELIVERING: {
          label: "Đang giao",
          color: "#055160",
          bgColor: "#cff4fc",
          borderColor: "#b6effb",
        },
        DELIVERED: {
          label: "Đã giao",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },
        CANCELLED: {
          label: "Đã huỷ",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
        RETURNED: {
          label: "Đã hoàn trả",
          color: "#664d03",
          bgColor: "#fff3cd",
          borderColor: "#ffecb5",
        },
        SUCCESS: {
          label: "Giao thành công",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },
        FAILED: {
          label: "Giao thất bại",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
        NEED_TO_SHIP: {
          label: "Cần vận chuyển",
          color: "#055160",
          bgColor: "#cff4fc",
          borderColor: "#b6effb",
        },
        PENDING: {
          label: "Chờ xử lý",
          color: "#055160",
          bgColor: "#cff4fc",
          borderColor: "#b6effb",
        },
        COD: {
          label: "Thanh toán khi nhận hàng",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },
      },
      productInstanceStatus: {
        AVAILABLE: {
          label: "Còn hàng",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },
        OUT_OF_STOCK: {
          label: "Hết hàng",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
        DISCONTINUED: {
          label: "Ngừng kinh doanh",
          color: "#664d03",
          bgColor: "#fff3cd",
          borderColor: "#ffecb5",
        },
        SOLD: {
          label: "Đã bán",
          color: "#084298",
          bgColor: "#cfe2ff",
          borderColor: "#b6d4fe",
        },
        RESERVED: {
          label: "Đã đặt trước",
          color: "#055160",
          bgColor: "#cff4fc",
          borderColor: "#b6effb",
        },
        DAMAGED: {
          label: "Bị hư hỏng",
          color: "#58151c",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
      },
      equipment: {
        ACTIVE: {
          label: "Hoạt động",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },
        INACTIVE: {
          label: "Không hoạt động",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
        MAINTENANCE: {
          label: "Đang bảo trì",
          color: "#664d03",
          bgColor: "#fff3cd",
          borderColor: "#ffecb5",
        },
        RETIRED: {
          label: "Đã ngưng sử dụng",
          color: "#41464b",
          bgColor: "#e2e3e5",
          borderColor: "#d3d6d8",
        },
      },
      product_instances: {
        AVAILABLE: {
          label: "Còn hàng",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },
        OUT_OF_STOCK: {
          label: "Hết hàng",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
        DISCONTINUED: {
          label: "Ngừng kinh doanh",
          color: "#664d03",
          bgColor: "#fff3cd",
          borderColor: "#ffecb5",
        },
        SOLD: {
          label: "Đã bán",
          color: "#084298",
          bgColor: "#cfe2ff",
          borderColor: "#b6d4fe",
        },
        RESERVED: {
          label: "Đã đặt trước",
          color: "#055160",
          bgColor: "#cff4fc",
          borderColor: "#b6effb",
        },
        DAMAGED: {
          label: "Bị hư hỏng",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
      },
      productionPlans: {
        PLANNED: {
          label: "Đã lập kế hoạch",
          color: "#084298",
          bgColor: "#cfe2ff",
          borderColor: "#b6d4fe",
        },
        IN_PROGRESS: {
          label: "Đang tiến hành",
          color: "#055160",
          bgColor: "#cff4fc",
          borderColor: "#b6effb",
        },
        COMPLETED: {
          label: "Đã hoàn thành",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },
        CANCELED: {
          label: "Đã hủy",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
      },
      productionSteps: {
        PENDING: {
          label: "Chờ xử lý",
          color: "#055160",
          bgColor: "#cff4fc",
          borderColor: "#b6effb",
        },
        IN_PROGRESS: {
          label: "Đang tiến hành",
          color: "#055160",
          bgColor: "#cff4fc",
          borderColor: "#b6effb",
        },
        COMPLETED: {
          label: "Đã hoàn thành",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },
        CANCELED: {
          label: "Đã hủy",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
        FAILED: {
          label: "Thất bại",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
      },
      payment: {
        UNPAID: {
          label: "Chưa thanh toán",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
        PAID: {
          label: "Đã thanh toán",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },
        PENDING: {
          label: "Đang chờ thanh toán",
          color: "#41464b",
          bgColor: "#e2e3e5",
          borderColor: "#d3d6d8",
        },
        FAILED: {
          label: "Thanh toán thất bại",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
        REFUNDED: {
          label: "Đã hoàn tiền",
          color: "#664d03",
          bgColor: "#fff3cd",
          borderColor: "#ffecb5",
        },
      },
      shipping: {
        PENDING: {
          label: "Chờ vận chuyển",
          color: "#41464b",
          bgColor: "#e2e3e5",
          borderColor: "#d3d6d8",
        },
        PROCESSING: {
          label: "Đang chuẩn bị hàng",
          color: "#055160",
          bgColor: "#cff4fc",
          borderColor: "#b6effb",
        },
        PICKED: {
          label: "Đã lấy hàng",
          color: "#084298",
          bgColor: "#cfe2ff",
          borderColor: "#b6d4fe",
        },
        DELIVERING: {
          label: "Đang giao hàng",
          color: "#055160",
          bgColor: "#cff4fc",
          borderColor: "#b6effb",
        },
        DELIVERED: {
          label: "Đã giao hàng",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },
        RETURNED: {
          label: "Đã hoàn trả",
          color: "#664d03",
          bgColor: "#fff3cd",
          borderColor: "#ffecb5",
        },
        FAILED: {
          label: "Giao hàng thất bại",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
      },

      default: {
        ACTIVE: {
          label: "Hoạt động",
          color: "#0f5132",
          bgColor: "#d1e7dd",
          borderColor: "#badbcc",
        },
        INACTIVE: {
          label: "Không hoạt động",
          color: "#842029",
          bgColor: "#f8d7da",
          borderColor: "#f5c2c7",
        },
        MAINTENANCE: {
          label: "Đang bảo trì",
          color: "#664d03",
          bgColor: "#fff3cd",
          borderColor: "#ffecb5",
        },
        RETIRED: {
          label: "Đã ngưng sử dụng",
          color: "#41464b",
          bgColor: "#e2e3e5",
          borderColor: "#d3d6d8",
        },
      },
    };

    const map = key && statusMaps[key] ? statusMaps[key] : statusMaps.default;
    return (
      map[status] || {
        label: status || "Không xác định",
        color: "#444",
        bgColor: "#f8f9fa",
        borderColor: "#ced4da",
      }
    );
  },
  formatDateTime: (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);

    // Tạo giờ theo múi giờ Việt Nam (UTC+7)
    // Cách đơn giản: +7 giờ với UTC
    const offset = 7 * 60; // phút
    const localDate = new Date(date.getTime() + offset * 60000);

    const day = localDate.getDate().toString().padStart(2, "0");
    const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
    const year = localDate.getFullYear();

    const hours = localDate.getHours().toString().padStart(2, "0");
    const minutes = localDate.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  },

  hasPermission: (listPermissionStr, routerName, action) => {
    if (!listPermissionStr) return false;
    try {
      let permissions = JSON.parse(listPermissionStr);

      // Nếu parse 1 lần ra vẫn là chuỗi, parse tiếp
      if (typeof permissions === "string") {
        permissions = JSON.parse(permissions);
      }

      // permissions bây giờ chắc chắn là mảng rồi
      const routerPerm = permissions.find((p) => p.router === routerName);
      return routerPerm?.actions.includes(action);
    } catch (error) {
      console.error("Parse LIST_PERMISION error:", error);
      return false;
    }
  },

  // Hàm mã hóa dữ liệu
  encryptData: (data) => {
    try {
      const jsonData = JSON.stringify(data);
      return CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
    } catch (error) {
      console.error("Lỗi mã hóa:", error);
      return null;
    }
  },

  // Hàm giải mã dữ liệu
  decryptData: (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error("Lỗi giải mã:", error);
      return null;
    }
  },

  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  handleAxiosResponse: (response) => {
    if (!response) {
      enqueueSnackbar("Không có phản hồi từ server", { variant: "error" });
      return;
    }

    switch (response.status) {
      case 200:
        enqueueSnackbar("Thao tác thành công!", { variant: "success" });
        break;

      case 201:
        enqueueSnackbar("Tạo mới thành công!", { variant: "success" });
        break;

      case 204:
        enqueueSnackbar("Xóa thành công!", { variant: "success" });
        break;

      case 400:
        enqueueSnackbar("Yêu cầu không hợp lệ!", { variant: "warning" });
        break;

      case 401:
        enqueueSnackbar("Bạn chưa đăng nhập!", { variant: "warning" });
        break;

      case 403:
        enqueueSnackbar("Bạn không có quyền thực hiện thao tác này!", {
          variant: "warning",
        });
        break;

      case 404:
        enqueueSnackbar("Không tìm thấy dữ liệu!", { variant: "error" });
        break;

      case 500:
        enqueueSnackbar("Lỗi server, vui lòng thử lại!", { variant: "error" });
        break;

      default:
        enqueueSnackbar(`Có lỗi xảy ra (status ${response.status})`, {
          variant: "error",
        });
        break;
    }
  },
};
export default spService;
