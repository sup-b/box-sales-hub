export interface Product {
  id: string;
  name: string;
  category: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  image: string;
}

export interface OrderItem {
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  total: number;
  date: string;
  status: "pending" | "preparing" | "shipping" | "completed" | "cancelled";
  items: number;
  orderItems: OrderItem[];
}

export const orders: Order[] = [
  { id: "DH1024", customerName: "Nguyễn Minh Tú", phone: "0901 234 567", address: "12 Nguyễn Huệ, Q.1, TP.HCM", total: 2180000, date: "21/03/2026", status: "pending", items: 3, orderItems: [{ name: "Áo Blazer Oversized", size: "M", color: "Đen", quantity: 1, price: 1290000 }, { name: "Quần Jeans Straight", size: "29", color: "Xanh đậm", quantity: 1, price: 890000 }] },
  { id: "DH1023", customerName: "Trần Hải Đăng", phone: "0912 345 678", address: "45 Lê Lợi, Q.3, TP.HCM", total: 890000, date: "21/03/2026", status: "preparing", items: 1, orderItems: [{ name: "Quần Jeans Straight", size: "30", color: "Xanh đậm", quantity: 1, price: 890000 }] },
  { id: "DH1022", customerName: "Lê Phương Anh", phone: "0923 456 789", address: "78 Trần Hưng Đạo, Q.5, TP.HCM", total: 1640000, date: "20/03/2026", status: "shipping", items: 2, orderItems: [{ name: "Áo Khoác Denim", size: "XL", color: "Xanh nhạt", quantity: 1, price: 1150000 }, { name: "Áo Polo Basic", size: "L", color: "Trắng", quantity: 1, price: 450000 }] },
  { id: "DH1021", customerName: "Phạm Quốc Bảo", phone: "0934 567 890", address: "23 Hai Bà Trưng, Q.1, TP.HCM", total: 450000, date: "20/03/2026", status: "completed", items: 1, orderItems: [{ name: "Áo Polo Basic", size: "M", color: "Trắng", quantity: 1, price: 450000 }] },
  { id: "DH1020", customerName: "Hoàng Thị Mai", phone: "0945 678 901", address: "156 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM", total: 3470000, date: "19/03/2026", status: "completed", items: 4, orderItems: [{ name: "Áo Blazer Oversized", size: "S", color: "Đen", quantity: 1, price: 1290000 }, { name: "Áo Khoác Denim", size: "M", color: "Xanh nhạt", quantity: 1, price: 1150000 }, { name: "Quần Short Kaki", size: "28", color: "Be", quantity: 2, price: 520000 }] },
  { id: "DH1019", customerName: "Võ Đức Huy", phone: "0956 789 012", address: "89 Nguyễn Thị Minh Khai, Q.3, TP.HCM", total: 1150000, date: "19/03/2026", status: "cancelled", items: 1, orderItems: [{ name: "Áo Khoác Denim", size: "L", color: "Xanh nhạt", quantity: 1, price: 1150000 }] },
  { id: "DH1018", customerName: "Đặng Thanh Hà", phone: "0967 890 123", address: "34 Võ Văn Tần, Q.3, TP.HCM", total: 970000, date: "18/03/2026", status: "completed", items: 2, orderItems: [{ name: "Quần Short Kaki", size: "30", color: "Be", quantity: 1, price: 520000 }, { name: "Áo Polo Basic", size: "M", color: "Trắng", quantity: 1, price: 450000 }] },
];

export const weeklyRevenue = [
  { day: "T2", revenue: 4200000 },
  { day: "T3", revenue: 3800000 },
  { day: "T4", revenue: 5100000 },
  { day: "T5", revenue: 4600000 },
  { day: "T6", revenue: 6800000 },
  { day: "T7", revenue: 8200000 },
  { day: "CN", revenue: 7100000 },
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export const statusConfig: Record<Order["status"], { label: string; className: string }> = {
  pending: { label: "Chờ xác nhận", className: "bg-warning/15 text-warning" },
  preparing: { label: "Đang chuẩn bị", className: "bg-info/15 text-info" },
  shipping: { label: "Đang giao", className: "bg-info/15 text-info" },
  completed: { label: "Hoàn thành", className: "bg-success/15 text-success" },
  cancelled: { label: "Đã hủy", className: "bg-destructive/15 text-destructive" },
};
