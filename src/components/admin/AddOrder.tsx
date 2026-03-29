import { useState } from "react";
import { ArrowLeft, Save, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCreateOrder, type CreateOrderPayload } from "@/hooks/use-orders";
import { useProducts, type Product } from "@/hooks/use-products";
import { formatCurrency } from "@/data/dummy-data";
import { toast } from "sonner";

interface Props {
  onBack: () => void;
}

interface OrderItem {
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

const AddOrder = ({ onBack }: Props) => {
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [items, setItems] = useState<OrderItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const { data: products = [] } = useProducts();
  const createOrder = useCreateOrder();

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const addItem = (product: Product) => {
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      setItems(items.map((i) =>
        i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setItems([...items, {
        productId: product.id,
        name: product.name,
        size: product.size,
        color: product.color,
        price: product.price,
        quantity: 1,
      }]);
    }
    setShowPicker(false);
  };

  const updateQty = (idx: number, qty: number) => {
    if (qty < 1) return;
    setItems(items.map((item, i) => (i === idx ? { ...item, quantity: qty } : item)));
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!customer.name.trim()) { toast.error("Vui lòng nhập tên khách hàng"); return; }
    if (!customer.phone.trim()) { toast.error("Vui lòng nhập số điện thoại"); return; }
    if (!customer.address.trim()) { toast.error("Vui lòng nhập địa chỉ"); return; }
    if (items.length === 0) { toast.error("Vui lòng thêm ít nhất 1 sản phẩm"); return; }

    const payload: CreateOrderPayload = {
      customer_name: customer.name,
      phone: customer.phone,
      address: customer.address,
      items: items.map(({ name, size, color, price, quantity }) => ({ name, size, color, price, quantity })),
    };

    createOrder.mutate(payload, {
      onSuccess: (orderId) => {
        toast.success(`Đã tạo đơn hàng #${orderId}`);
        onBack();
      },
      onError: () => toast.error("Lỗi khi tạo đơn hàng"),
    });
  };

  if (showPicker) {
    return (
      <div className="animate-fade-up space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPicker(false)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted active:scale-95">
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <h1 className="text-lg font-bold">Chọn sản phẩm</h1>
        </div>
        <div className="space-y-2">
          {products.filter((p) => p.stock > 0).map((p) => (
            <button
              key={p.id}
              onClick={() => addItem(p)}
              className="flex w-full gap-3 rounded-xl border border-border bg-card p-3 text-left shadow-sm active:scale-[0.98] transition-transform"
            >
              <img src={p.image} alt={p.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.size} · {p.color}</p>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-sm font-bold text-primary">{formatCurrency(p.price)}</span>
                  <span className="text-xs text-muted-foreground">Còn {p.stock}</span>
                </div>
              </div>
            </button>
          ))}
          {products.filter((p) => p.stock > 0).length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">Không có sản phẩm còn hàng</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm font-medium text-muted-foreground active:scale-95 transition-transform">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
        <button
          onClick={handleSave}
          disabled={createOrder.isPending}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm active:scale-95 transition-transform disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {createOrder.isPending ? "Đang lưu..." : "Tạo đơn"}
        </button>
      </div>

      {/* Customer info */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <h2 className="text-sm font-semibold">Thông tin khách hàng</h2>
        <Field label="Tên khách hàng">
          <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Nguyễn Văn A" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
        </Field>
        <Field label="Số điện thoại">
          <input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="0987654321" type="tel" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
        </Field>
        <Field label="Địa chỉ giao hàng">
          <textarea value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} placeholder="123 Đường ABC, Quận 1, TP.HCM" rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2 resize-none" />
        </Field>
      </div>

      {/* Order items */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Sản phẩm ({items.length})</h2>
          <button onClick={() => setShowPicker(true)} className="flex items-center gap-1 text-xs font-semibold text-primary active:scale-95 transition-transform">
            <Plus className="h-3.5 w-3.5" />
            Thêm
          </button>
        </div>

        {items.length === 0 ? (
          <button onClick={() => setShowPicker(true)} className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border py-8 text-muted-foreground active:scale-[0.98]">
            <ShoppingBag className="h-8 w-8" />
            <p className="text-sm font-medium">Chạm để chọn sản phẩm</p>
          </button>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.size} · {item.color} · {formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-lg border border-border">
                    <button onClick={() => updateQty(idx, item.quantity - 1)} className="px-2 py-1 text-sm font-bold text-muted-foreground active:scale-95">−</button>
                    <span className="min-w-[24px] text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQty(idx, item.quantity + 1)} className="px-2 py-1 text-sm font-bold text-muted-foreground active:scale-95">+</button>
                  </div>
                  <button onClick={() => removeItem(idx)} className="p-1 text-destructive active:scale-95">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-medium text-muted-foreground">Tổng cộng</span>
            <span className="text-base font-bold text-primary">{formatCurrency(total)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    {children}
  </div>
);

export default AddOrder;
