import { useState } from "react";
import { ArrowLeft, Save, ImagePlus } from "lucide-react";
import { useAddProduct, type ProductInsert } from "@/hooks/use-products";
import { toast } from "sonner";

interface Props {
  onBack: () => void;
}

const defaultForm: Omit<ProductInsert, "id"> = {
  name: "",
  category: "Áo",
  size: "M",
  color: "",
  price: 0,
  stock: 0,
  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
};

const AddProduct = ({ onBack }: Props) => {
  const [form, setForm] = useState({ ...defaultForm });
  const addProduct = useAddProduct();

  const set = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Tên sản phẩm không được để trống");
      return;
    }
    if (form.price <= 0) {
      toast.error("Giá phải lớn hơn 0");
      return;
    }
    if (!form.color.trim()) {
      toast.error("Vui lòng nhập màu sắc");
      return;
    }

    const id = `SP${String(Date.now()).slice(-6)}`;
    addProduct.mutate(
      { ...form, id },
      {
        onSuccess: () => {
          toast.success("Đã thêm sản phẩm mới");
          onBack();
        },
        onError: () => toast.error("Lỗi khi thêm sản phẩm"),
      }
    );
  };

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
        <button
          onClick={handleSave}
          disabled={addProduct.isPending}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm active:scale-95 transition-transform disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {addProduct.isPending ? "Đang lưu..." : "Lưu"}
        </button>
      </div>

      <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50 p-8">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImagePlus className="h-10 w-10" />
          <p className="text-xs font-medium">Ảnh mặc định</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <Field label="Tên sản phẩm">
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Nhập tên sản phẩm..."
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
              value={form.price || ""}
              onChange={(e) => set("price", Number(e.target.value))}
              placeholder="0"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Size">
            <select
              value={form.size}
              onChange={(e) => set("size", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            >
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
              <option>XXL</option>
              <option>Free Size</option>
            </select>
          </Field>
          <Field label="Màu sắc">
            <input
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              placeholder="VD: Đen"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />
          </Field>
          <Field label="Tồn kho">
            <input
              type="number"
              value={form.stock || ""}
              onChange={(e) => set("stock", Number(e.target.value))}
              placeholder="0"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />
          </Field>
        </div>

        <Field label="URL hình ảnh">
          <input
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          />
        </Field>
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

export default AddProduct;
