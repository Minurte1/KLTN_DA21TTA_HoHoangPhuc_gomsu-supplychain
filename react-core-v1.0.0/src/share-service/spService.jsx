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
};
export default spService;
