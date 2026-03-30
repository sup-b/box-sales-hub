import { useState, useMemo } from "react";
import { ClipboardList, Plus, Search, CalendarIcon, X } from "lucide-react";
import { format, parse, isWithinInterval, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { formatCurrency, statusConfig } from "@/data/dummy-data";
import { useOrders, type Order, type OrderStatus } from "@/hooks/use-orders";
import OrderDetail from "./OrderDetail";
import AddOrder from "./AddOrder";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const { data: orders = [], isLoading } = useOrders();

  const filtered = useMemo(() => {
    let result = filter === "all" ? orders : orders.filter((o) => o.status === filter);

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q)
      );
    }

    if (dateFrom || dateTo) {
      result = result.filter((o) => {
        // Parse Vietnamese date format dd/MM/yyyy
        const parsed = parse(o.date, "d/M/yyyy", new Date());
        if (!isValid(parsed)) return true;
        if (dateFrom && parsed < dateFrom) return false;
        if (dateTo) {
          const end = new Date(dateTo);
          end.setHours(23, 59, 59, 999);
          if (parsed > end) return false;
        }
        return true;
      });
    }

    return result;
  }, [orders, filter, search, dateFrom, dateTo]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;
  const hasDateFilter = dateFrom || dateTo;

  if (adding) return <AddOrder onBack={() => setAdding(false)} />;
  if (selectedOrder) return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrderId(null)} />;

  return (
    <div className="animate-fade-up space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Đơn hàng</h1>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm active:scale-95 transition-transform">
          <Plus className="h-4 w-4" />
          Tạo đơn
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên, mã đơn, SĐT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-9 h-10 rounded-xl"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Date range */}
      <div className="flex gap-2 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-9 rounded-xl text-xs gap-1.5 flex-1", dateFrom && "text-foreground")}>
              <CalendarIcon className="h-3.5 w-3.5" />
              {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Từ ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
        <span className="text-xs text-muted-foreground">→</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-9 rounded-xl text-xs gap-1.5 flex-1", dateTo && "text-foreground")}>
              <CalendarIcon className="h-3.5 w-3.5" />
              {dateTo ? format(dateTo, "dd/MM/yyyy") : "Đến ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
        {hasDateFilter && (
          <button onClick={() => { setDateFrom(undefined); setDateTo(undefined); }} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors active:scale-95 ${
              filter === s ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"
            }`}
          >
            {filterLabels[s]}
          </button>
        ))}
      </div>

      {/* Results */}
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
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusConfig[order.status as keyof typeof statusConfig].className}`}>
                {statusConfig[order.status as keyof typeof statusConfig].label}
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">{order.items} sản phẩm · {order.date}</p>
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
