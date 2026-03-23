import { useState, useEffect } from "react";
import { ArrowLeft, Camera, Store, User, Phone, MapPin, Mail, FileText, Check } from "lucide-react";
import { toast } from "sonner";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/use-store-settings";

const fields: { key: "name" | "representative" | "phone" | "address" | "email" | "tax_id"; label: string; icon: React.ElementType; type?: string; placeholder: string }[] = [
  { key: "name", label: "Tên cửa hàng", icon: Store, placeholder: "Nhập tên cửa hàng" },
  { key: "representative", label: "Người đại diện", icon: User, placeholder: "Nhập họ tên người đại diện" },
  { key: "phone", label: "Số điện thoại", icon: Phone, type: "tel", placeholder: "Nhập số điện thoại" },
  { key: "address", label: "Địa chỉ", icon: MapPin, placeholder: "Nhập địa chỉ cửa hàng" },
  { key: "email", label: "Email liên hệ", icon: Mail, type: "email", placeholder: "Nhập email liên hệ" },
  { key: "tax_id", label: "Mã số thuế / GPKD", icon: FileText, placeholder: "Nhập mã số thuế" },
];

interface Props {
  onBack: () => void;
}

const StoreInfoScreen = ({ onBack }: Props) => {
  const { data: settings, isLoading } = useStoreSettings();
  const updateSettings = useUpdateStoreSettings();
  const [form, setForm] = useState({ name: "", representative: "", phone: "", address: "", email: "", tax_id: "" });

  useEffect(() => {
    if (settings) {
      setForm({
        name: settings.name,
        representative: settings.representative,
        phone: settings.phone,
        address: settings.address,
        email: settings.email,
        tax_id: settings.tax_id,
      });
    }
  }, [settings]);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    if (settings) {
      updateSettings.mutate({ id: settings.id, ...form });
      toast.success("Đã lưu thông tin cửa hàng");
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fade-up space-y-5 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors active:scale-95">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">Thông tin cửa hàng</h1>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-5 pb-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors active:scale-95">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Thông tin cửa hàng</h1>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground shadow-md">
            TB
          </div>
          <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-secondary-foreground shadow-sm active:scale-90 transition-transform">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-xs font-medium text-muted-foreground">Nhấn để thay đổi logo</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <f.icon className="h-3.5 w-3.5" />
              {f.label}
            </label>
            <input
              type={f.type || "text"}
              value={form[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring transition-shadow focus:ring-2"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={updateSettings.isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        <Check className="h-4 w-4" />
        {updateSettings.isPending ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </div>
  );
};

export default StoreInfoScreen;
