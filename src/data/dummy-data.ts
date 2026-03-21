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

export const products: Product[] = [
  { id: "SP001", name: "Áo Blazer Oversized", category: "Áo", size: "M", color: "Đen", price: 1290000, stock: 12, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop" },
  { id: "SP002", name: "Quần Jeans Straight", category: "Quần", size: "29", color: "Xanh đậm", price: 890000, stock: 8, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" },
  { id: "SP003", name: "Áo Polo Basic", category: "Áo", size: "L", color: "Trắng", price: 450000, stock: 25, image: "https://images.unsplash.com/photo-1625910513413-5fc42fc5c2b4?w=200&h=200&fit=crop" },
  { id: "SP004", name: "Túi Tote Canvas", category: "Phụ kiện", size: "Free", color: "Kem", price: 350000, stock: 3, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop" },
  { id: "SP005", name: "Áo Khoác Denim", category: "Áo", size: "XL", color: "Xanh nhạt", price: 1150000, stock: 6, image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&h=200&fit=crop" },
  { id: "SP006", name: "Quần Short Kaki", category: "Quần", size: "30", color: "Be", price: 520000, stock: 15, image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200&h=200&fit=crop" },
  { id: "SP007", name: "Mũ Bucket Hat", category: "Phụ kiện", size: "Free", color: "Đen", price: 280000, stock: 2, image: "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=200&h=200&fit=crop" },
  { id: "SP008", name: "Áo Sơ Mi Linen", category: "Áo", size: "M", color: "Xanh rêu", price: 680000, stock: 0, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop" },
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
