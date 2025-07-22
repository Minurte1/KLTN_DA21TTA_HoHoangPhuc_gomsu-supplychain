const baseListPermission = [
  // Dashboard: Truy cập bảng điều khiển chung, áp dụng cho tất cả công ty (MANUFACTURER, SUPPLIER, RETAILER, WAREHOUSE, TRANSPORT)
  {
    router: "dashboard",
    actions: ["access"],
  },
  // Role: Quản lý vai trò, thường dành cho admin của bất kỳ công ty nào (MANUFACTURER, SUPPLIER, RETAILER, WAREHOUSE, TRANSPORT)
  {
    router: "role",
    actions: ["view", "create", "update", "delete"],
  },
  // User: Quản lý người dùng, áp dụng cho admin của các công ty (MANUFACTURER, SUPPLIER, RETAILER, WAREHOUSE, TRANSPORT)
  {
    router: "user",
    actions: ["view", "create", "update", "delete"],
  },
  // Company: Quản lý thông tin công ty, thường dành cho admin cấp cao của tất cả công ty (MANUFACTURER, SUPPLIER, RETAILER, WAREHOUSE, TRANSPORT)
  {
    router: "company",
    actions: ["view", "create", "update", "delete"],
  },
  // Company Type: Quản lý loại công ty, thường dành cho admin hệ thống, không phụ thuộc công ty cụ thể
  {
    router: "company_type",
    actions: ["view", "create", "update", "delete"],
  },
  // Product: Quản lý sản phẩm, chủ yếu dành cho MANUFACTURER (tạo sản phẩm) và RETAILER (bán sản phẩm)
  {
    router: "product",
    actions: ["view", "create", "update", "delete"],
  },
  // Category: Quản lý danh mục sản phẩm, áp dụng cho MANUFACTURER và RETAILER
  {
    router: "category",
    actions: ["view", "create", "update", "delete"],
  },
  // Material: Quản lý nguyên vật liệu, chủ yếu dành cho SUPPLIER (cung cấp) và MANUFACTURER (sử dụng)
  {
    router: "material",
    actions: ["view", "create", "update", "delete"],
  },
  // Material Type: Quản lý loại nguyên vật liệu, áp dụng cho SUPPLIER và MANUFACTURER
  {
    router: "material_type",
    actions: ["view", "create", "update", "delete"],
  },
  // Material Order: Quản lý đơn đặt hàng nguyên vật liệu, dành cho MANUFACTURER (đặt hàng) và SUPPLIER (cung cấp)
  {
    router: "material_order",
    actions: ["view", "create", "update", "delete", "approve"],
  },
  {
    router: "material_order_master",
    actions: ["view", "create", "update", "delete", "approve"],
  },
  {
    router: "material_order_master_pending",
    actions: ["view", "create", "update", "delete", "approve"],
  },
  {
    router: "material_order_master_buy_pending",
    actions: ["view", "create", "update", "delete", "approve"],
  },
  {
    router: "material_order_master_ship_pending",
    actions: ["view", "create", "update", "delete", "approve"],
  },
  // Order: Quản lý đơn hàng, chủ yếu dành cho RETAILER (xử lý bán hàng), TRANSPORT có thể xem để sắp xếp vận chuyển
  {
    router: "order",
    actions: ["view", "create", "update", "delete", "ship"],
  },
  // Order Item: Quản lý chi tiết đơn hàng, chủ yếu dành cho RETAILER
  {
    router: "order_item",
    actions: ["view", "create", "update", "delete"],
  },
  // Production Plan: Quản lý kế hoạch sản xuất, chỉ dành cho MANUFACTURER
  {
    router: "production_plans",
    actions: ["view", "create", "update", "delete", "start", "complete"],
  },
  // Production Step: Quản lý các bước sản xuất, chỉ dành cho MANUFACTURER
  {
    router: "production_steps",
    actions: ["view", "create", "update", "delete", "start", "complete"],
  },
  {
    router: "equipment",
    actions: ["view", "create", "update", "delete"],
  },
  // Production Material: Quản lý nguyên liệu sản xuất, chỉ dành cho MANUFACTURER
  {
    router: "production_material",
    actions: ["view", "create", "update", "delete"],
  },
  {
    router: "product_instances",
    actions: ["view", "create", "update", "delete"],
  },

  // Transport Order: Quản lý đơn vận chuyển, chủ yếu dành cho TRANSPORT, MANUFACTURER và RETAILER có thể xem để theo dõi
  {
    router: "transport_orders",
    actions: ["view", "create", "update", "delete", "ship"],
  },
  // Cart: Quản lý giỏ hàng, chủ yếu dành cho RETAILER hoặc người dùng cuối
  {
    router: "cart",
    actions: ["view", "create", "update", "delete"],
  },
];

module.exports = baseListPermission;
