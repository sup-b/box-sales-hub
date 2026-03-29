import { useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { formatCurrency, statusConfig } from "@/data/dummy-data";
import { useOrders, type Order, type OrderStatus } from "@/hooks/use-orders";
import OrderDetail from "./OrderDetail";
import AddOrder from "./AddOrder";

const statusFilters: (OrderStatus | "all")[] = ["all", "pending", "preparing", "shipping", "completed", "cancelled"];
const filterLabels: Record<string, string> = {
  all: "Tất cả",
  pending: "Chờ xác nhận",
  preparing: "Đang chuẩn bị",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const OrderList = () => {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const { data: orders = [], isLoading } = useOrders();

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;

  if (adding) {
    return <AddOrder onBack={() => setAdding(false)} />;
  }

  if (selectedOrder) {
    return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrderId(null)} />;
  }

  return (
    <div className="animate-fade-up space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Đơn hàng</h1>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm active:scale-95 transition-transform">
          <Plus className="h-4 w-4" />
          Tạo đơn
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors active:scale-95 ${
              filter === s
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {filterLabels[s]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground text-center py-8">Đang tải...</p>}
        {!isLoading && filtered.map((order) => (
          <button
            key={order.id}
            onClick={() => setSelectedOrderId(order.id)}
            className="w-full text-left rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">#{order.id}</p>
                <p className="mt-0.5 text-sm font-semibold">{order.customer_name}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusConfig[order.status as keyof typeof statusConfig].className}`}
              >
                {statusConfig[order.status as keyof typeof statusConfig].label}
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
              <div>
                <p className="text-xs text-muted-foreground">{order.items} sản phẩm · {order.date}</p>
              </div>
              <p className="text-sm font-bold text-primary">{formatCurrency(order.total)}</p>
            </div>
          </button>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <ClipboardList className="h-10 w-10" />
            <p className="text-sm">Không có đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
