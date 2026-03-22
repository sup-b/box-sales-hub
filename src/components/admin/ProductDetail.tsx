import { useState } from "react";
import { ArrowLeft, Pencil, Trash2, Save, X } from "lucide-react";
import { formatCurrency, type Product } from "@/data/dummy-data";
import { toast } from "sonner";
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

interface Props {
  product: Product;
  onBack: () => void;
  onUpdate: (updated: Product) => void;
  onDelete: (id: string) => void;
}

const ProductDetail = ({ product, onBack, onUpdate, onDelete }: Props) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...product });

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Tên sản phẩm không được để trống");
      return;
    }
    if (form.price <= 0) {
      toast.error("Giá phải lớn hơn 0");
      return;
    }
    onUpdate(form);
    setEditing(false);
    toast.success("Đã cập nhật sản phẩm");
  };

  const handleDelete = () => {
    onDelete(product.id);
    toast.success("Đã xóa sản phẩm");
  };

  const handleCancel = () => {
    setForm({ ...product });
    setEditing(false);
  };

  const set = (key: keyof Product, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="animate-fade-up space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
        <div className="flex gap-2">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm active:scale-95 transition-transform"
            >
              <Pencil className="h-3.5 w-3.5" />
              Sửa
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground active:scale-95 transition-transform"
              >
                <X className="h-3.5 w-3.5" />
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-lg bg-success px-3 py-2 text-xs font-semibold text-success-foreground shadow-sm active:scale-95 transition-transform"
              >
                <Save className="h-3.5 w-3.5" />
                Lưu
              </button>
            </>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="overflow-hidden rounded-2xl border border-border">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full object-cover"
        />
      </div>

      {/* Info / Edit form */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        {editing ? (
          <>
            <Field label="Tên sản phẩm">
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Danh mục">
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                >
                  <option>Áo</option>
                  <option>Quần</option>
                  <option>Phụ kiện</option>
                </select>
              </Field>
              <Field label="Giá (VND)">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Size">
                <input
                  value={form.size}
                  onChange={(e) => set("size", e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                />
              </Field>
              <Field label="Màu sắc">
                <input
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                />
              </Field>
              <Field label="Tồn kho">
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => set("stock", Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                />
              </Field>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold leading-tight">{product.name}</h2>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(product.price)}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <InfoChip label="Danh mục" value={product.category} />
              <InfoChip label="Size" value={product.size} />
              <InfoChip label="Màu" value={product.color} />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <span className="text-xs font-medium text-muted-foreground">
                Tồn kho
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  product.stock === 0
                    ? "bg-destructive/15 text-destructive"
                    : product.stock <= 3
                    ? "bg-warning/15 text-warning"
                    : "bg-success/15 text-success"
                }`}
              >
                {product.stock === 0
                  ? "Hết hàng"
                  : `${product.stock} sản phẩm`}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Delete */}
      {!editing && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-semibold text-destructive active:scale-[0.98] transition-transform">
              <Trash2 className="h-4 w-4" />
              Xóa sản phẩm
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="mx-4 max-w-sm rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc muốn xóa "{product.name}"? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg">Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    {children}
  </div>
);

const InfoChip = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-muted px-3 py-2 text-center">
    <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
    <p className="text-sm font-semibold">{value}</p>
  </div>
);

export default ProductDetail;
