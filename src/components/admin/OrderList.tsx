import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { orders, formatCurrency, statusConfig, type Order } from "@/data/dummy-data";

const statusFilters: (Order["status"] | "all")[] = ["all", "pending", "preparing", "shipping", "completed", "cancelled"];
const filterLabels: Record<string, string> = {
  all: "Tất cả",
  pending: "Chờ xác nhận",
  preparing: "Đang chuẩn bị",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const OrderList = () => {
  const [filter, setFilter] = useState<Order["status"] | "all">("all");
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="animate-fade-up space-y-4">
      <h1 className="text-xl font-bold tracking-tight">Đơn hàng</h1>

      {/* Status filter */}
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

      {/* Orders */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">#{order.id}</p>
                <p className="mt-0.5 text-sm font-semibold">{order.customerName}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusConfig[order.status].className}`}
              >
                {statusConfig[order.status].label}
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
              <div>
                <p className="text-xs text-muted-foreground">{order.items} sản phẩm · {order.date}</p>
              </div>
              <p className="text-sm font-bold text-primary">{formatCurrency(order.total)}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
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
