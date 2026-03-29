import { useState, useRef } from "react";
import { ArrowLeft, Save, ImagePlus, Loader2 } from "lucide-react";
import { useAddProduct, type ProductInsert } from "@/hooks/use-products";
import { useProductImageUpload } from "@/hooks/use-product-image";
import { toast } from "sonner";

interface Props {
  onBack: () => void;
}

const defaultForm: Omit<ProductInsert, "id" | "image"> = {
  name: "",
  category: "Áo",
  size: "M",
  color: "",
  price: 0,
  stock: 0,
};

const AddProduct = ({ onBack }: Props) => {
  const [form, setForm] = useState({ ...defaultForm });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const addProduct = useAddProduct();
  const { upload, uploading } = useProductImageUpload();

  const set = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));

    try {
      const url = await upload(file);
      setImageUrl(url);
      toast.success("Đã tải ảnh lên");
    } catch {
      toast.error("Lỗi khi tải ảnh lên");
      setPreviewUrl(null);
    }
  };

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
    if (!imageUrl) {
      toast.error("Vui lòng chọn ảnh sản phẩm");
      return;
    }

    const id = `SP${String(Date.now()).slice(-6)}`;
    addProduct.mutate(
      { ...form, id, image: imageUrl },
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
          disabled={addProduct.isPending || uploading}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm active:scale-95 transition-transform disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {addProduct.isPending ? "Đang lưu..." : "Lưu"}
        </button>
      </div>

      {/* Image upload area */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary/50 active:scale-[0.99]"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="aspect-square w-full object-cover" />
        ) : (
          <div className="flex aspect-square flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImagePlus className="h-12 w-12" />
            <p className="text-sm font-medium">Chạm để chọn ảnh</p>
            <p className="text-xs">JPG, PNG · tối đa 5MB</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </button>

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
