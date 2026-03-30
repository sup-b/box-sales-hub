import { useState, useMemo } from "react";
import { ClipboardList, Plus, Search, CalendarIcon, X, SlidersHorizontal, Package, Clock, Truck, CheckCircle2, XCircle, ListFilter } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { formatCurrency, statusConfig } from "@/data/dummy-data";
import { useOrders, type Order, type OrderStatus } from "@/hooks/use-orders";
import OrderDetail from "./OrderDetail";
import AddOrder from "./AddOrder";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type FilterKey = OrderStatus | "all";

const statusMeta: { key: FilterKey; label: string; icon: React.ElementType; colorClass: string; activeClass: string }[] = [
  { key: "all", label: "Tất cả", icon: ListFilter, colorClass: "text-primary", activeClass: "bg-primary text-primary-foreground" },
  { key: "pending", label: "Chờ xác nhận", icon: Clock, colorClass: "text-warning", activeClass: "bg-warning/15 text-warning border-warning/30" },
  { key: "preparing", label: "Đang chuẩn bị", icon: Package, colorClass: "text-info", activeClass: "bg-info/15 text-info border-info/30" },
  { key: "shipping", label: "Đang giao", icon: Truck, colorClass: "text-info", activeClass: "bg-info/15 text-info border-info/30" },
  { key: "completed", label: "Hoàn thành", icon: CheckCircle2, colorClass: "text-success", activeClass: "bg-success/15 text-success border-success/30" },
  { key: "cancelled", label: "Đã hủy", icon: XCircle, colorClass: "text-destructive", activeClass: "bg-destructive/15 text-destructive border-destructive/30" },
];

const quickFilters = ["Mới nhất", "Giá cao đến thấp", "Giá thấp đến cao"];

const OrderList = () => {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [activeQuickFilter, setActiveQuickFilter] = useState("Mới nhất");
  const { data: orders = [], isLoading } = useOrders();

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    for (const o of orders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  }, [orders]);

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

    // Quick sort
    if (activeQuickFilter === "Giá cao đến thấp") {
      result = [...result].sort((a, b) => b.total - a.total);
    } else if (activeQuickFilter === "Giá thấp đến cao") {
      result = [...result].sort((a, b) => a.total - b.total);
    }

    return result;
  }, [orders, filter, search, dateFrom, dateTo, activeQuickFilter]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;
  const hasDateFilter = dateFrom || dateTo;

  if (adding) return <AddOrder onBack={() => setAdding(false)} />;
  if (selectedOrder) return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrderId(null)} />;

  return (
    <div className="animate-fade-up space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Đơn hàng</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Quản lý & theo dõi đơn hàng</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm active:scale-95 transition-transform"
        >
          <Plus className="h-4 w-4" />
          Tạo đơn
        </button>
      </div>

      {/* Status Summary Cards */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
        {statusMeta.map(({ key, label, icon: Icon, colorClass, activeClass }) => {
          const isActive = filter === key;
          const count = statusCounts[key] || 0;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "shrink-0 flex flex-col items-center gap-1.5 rounded-2xl border px-4 py-3 min-w-[90px] transition-all active:scale-95",
                isActive
                  ? activeClass
                  : "bg-card border-border hover:border-muted-foreground/20"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "" : colorClass)} />
              <span className={cn("text-2xl font-bold leading-none", isActive ? "" : "text-foreground")}>
                {count}
              </span>
              <span className={cn("text-[10px] font-medium leading-tight text-center", isActive ? "" : "text-muted-foreground")}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2.5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm, mã đơn hàng..."
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="default"
                className={cn(
                  "h-10 rounded-xl gap-1.5 shrink-0",
                  hasDateFilter && "border-primary text-primary"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Bộ lọc
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 space-y-3" align="end">
              <p className="text-sm font-semibold text-foreground">Lọc theo ngày</p>
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
            </PopoverContent>
          </Popover>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {quickFilters.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveQuickFilter(chip)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors active:scale-95 border",
                activeQuickFilter === chip
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground/30"
              )}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-muted-foreground">
        Hiển thị <span className="font-semibold text-foreground">{filtered.length}</span> đơn hàng
      </p>

      {/* Order Cards */}
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
                <p className="text-xs text-muted-foreground font-mono">#{order.id}</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{order.customer_name}</p>
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
