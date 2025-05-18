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
};
export default spService;
