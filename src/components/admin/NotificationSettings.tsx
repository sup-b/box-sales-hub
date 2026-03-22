import { useState } from "react";
import { ArrowLeft, ShoppingBag, Users, Smartphone, Volume2, Vibrate, MessageSquare, Star, Bell, PackageX, RotateCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ToggleItem {
  key: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  defaultValue: boolean;
}

const orderGroup: ToggleItem[] = [
  { key: "newOrder", label: "Đơn hàng mới", desc: "Nhận thông báo khi có đơn hàng mới", icon: ShoppingBag, defaultValue: true },
  { key: "lowStock", label: "Cảnh báo sắp hết hàng", desc: "Khi tồn kho dưới ngưỡng cài đặt", icon: PackageX, defaultValue: true },
  { key: "returnCancel", label: "Yêu cầu hoàn trả/hủy đơn", desc: "Khách hàng yêu cầu đổi trả hoặc hủy", icon: RotateCcw, defaultValue: true },
];

const customerGroup: ToggleItem[] = [
  { key: "zaloMsg", label: "Tin nhắn mới từ Zalo OA", desc: "Tin nhắn từ khách qua Zalo Official", icon: MessageSquare, defaultValue: true },
  { key: "reviews", label: "Đánh giá sản phẩm", desc: "Khách hàng để lại đánh giá mới", icon: Star, defaultValue: false },
];

const systemGroup: ToggleItem[] = [
  { key: "push", label: "Thông báo đẩy", desc: "Hiển thị thông báo trên màn hình", icon: Bell, defaultValue: true },
  { key: "sound", label: "Âm thanh thông báo", desc: "Phát âm thanh khi nhận thông báo", icon: Volume2, defaultValue: true },
  { key: "vibrate", label: "Báo rung", desc: "Rung thiết bị khi nhận thông báo", icon: Vibrate, defaultValue: true },
];

const buildDefaults = (groups: ToggleItem[][]) => {
  const map: Record<string, boolean> = {};
  groups.flat().forEach((item) => (map[item.key] = item.defaultValue));
  return map;
};

interface Props {
  onBack: () => void;
}

const NotificationSettings = ({ onBack }: Props) => {
  const [toggles, setToggles] = useState(() =>
    buildDefaults([orderGroup, customerGroup, systemGroup])
  );

  const toggle = (key: string) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="animate-fade-up space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Cài đặt thông báo</h1>
      </div>

      {/* Groups */}
      <ToggleGroup title="Đơn hàng & Sản phẩm" items={orderGroup} values={toggles} onToggle={toggle} />
      <ToggleGroup title="Khách hàng" items={customerGroup} values={toggles} onToggle={toggle} />
      <ToggleGroup title="Hệ thống" items={systemGroup} values={toggles} onToggle={toggle} />
    </div>
  );
};

const ToggleGroup = ({
  title,
  items,
  values,
  onToggle,
}: {
  title: string;
  items: ToggleItem[];
  values: Record<string, boolean>;
  onToggle: (key: string) => void;
}) => (
  <div className="space-y-2">
    <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </h2>
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {items.map((item, i) => (
        <div
          key={item.key}
          className={`flex items-center gap-3 px-4 py-3.5 ${
            i < items.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-tight">{item.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{item.desc}</p>
          </div>
          <Switch
            checked={values[item.key]}
            onCheckedChange={() => onToggle(item.key)}
          />
        </div>
      ))}
    </div>
  </div>
);

export default NotificationSettings;
