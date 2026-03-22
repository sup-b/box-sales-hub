import { ArrowLeft, MapPin, Phone, User, Package } from "lucide-react";
import { formatCurrency, statusConfig, type Order } from "@/data/dummy-data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
}

const statusFlow: Order["status"][] = ["pending", "preparing", "shipping", "completed"];

const nextStatusLabel: Partial<Record<Order["status"], string>> = {
  pending: "Xác nhận đơn",
  preparing: "Bắt đầu giao",
  shipping: "Hoàn thành",
};

const OrderDetail = ({ order, onBack }: OrderDetailProps) => {
  const [status, setStatus] = useState(order.status);
  const cfg = statusConfig[status];

  const canAdvance = status !== "completed" && status !== "cancelled";
  const canCancel = status === "pending" || status === "preparing";

  const handleAdvance = () => {
    const idx = statusFlow.indexOf(status);
    if (idx >= 0 && idx < statusFlow.length - 1) {
      const next = statusFlow[idx + 1];
      setStatus(next);
      toast({ title: "Cập nhật trạng thái", description: `Đơn #${order.id} → ${statusConfig[next].label}` });
    }
  };

  const handleCancel = () => {
    setStatus("cancelled");
    toast({ title: "Đã hủy đơn", description: `Đơn #${order.id} đã bị hủy`, variant: "destructive" });
  };

  return (
    <div className="animate-fade-up space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors active:scale-95"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold tracking-tight">Đơn #{order.id}</h1>
          <p className="text-xs text-muted-foreground">{order.date}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.className}`}>
          {cfg.label}
        </span>
      </div>

      {/* Customer info */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold">Thông tin khách hàng</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-sm">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{order.phone}</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span>{order.address}</span>
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          Sản phẩm ({order.orderItems.length})
        </h2>
        <div className="divide-y divide-border">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.size} · {item.color} · x{item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-medium text-muted-foreground">Tổng cộng</span>
          <span className="text-base font-bold text-primary">{formatCurrency(order.total)}</span>
        </div>
      </div>

      {/* Status actions */}
      {(canAdvance || canCancel) && (
        <div className="flex gap-3 pt-1">
          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex-1 rounded-xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-semibold text-destructive transition-colors active:scale-[0.97]">
                  Hủy đơn
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="mx-4 max-w-sm rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Hủy đơn hàng?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc muốn hủy đơn #{order.id}? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-lg">Quay lại</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Xác nhận hủy
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {canAdvance && (
            <button
              onClick={handleAdvance}
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors active:scale-[0.97]"
            >
              {nextStatusLabel[status]}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
