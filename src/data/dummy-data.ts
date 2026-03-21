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

export interface Order {
  id: string;
  customerName: string;
  total: number;
  date: string;
  status: "pending" | "preparing" | "shipping" | "completed" | "cancelled";
  items: number;
}

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

export const orders: Order[] = [
  { id: "DH1024", customerName: "Nguyễn Minh Tú", total: 2180000, date: "21/03/2026", status: "pending", items: 3 },
  { id: "DH1023", customerName: "Trần Hải Đăng", total: 890000, date: "21/03/2026", status: "preparing", items: 1 },
  { id: "DH1022", customerName: "Lê Phương Anh", total: 1640000, date: "20/03/2026", status: "shipping", items: 2 },
  { id: "DH1021", customerName: "Phạm Quốc Bảo", total: 450000, date: "20/03/2026", status: "completed", items: 1 },
  { id: "DH1020", customerName: "Hoàng Thị Mai", total: 3470000, date: "19/03/2026", status: "completed", items: 4 },
  { id: "DH1019", customerName: "Võ Đức Huy", total: 1150000, date: "19/03/2026", status: "cancelled", items: 1 },
  { id: "DH1018", customerName: "Đặng Thanh Hà", total: 970000, date: "18/03/2026", status: "completed", items: 2 },
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
