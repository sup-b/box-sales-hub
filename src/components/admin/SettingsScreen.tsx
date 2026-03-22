import { useState } from "react";
import { Store, Bell, Shield, LogOut, ChevronRight } from "lucide-react";
import NotificationSettings from "./NotificationSettings";
import StoreInfoScreen from "./StoreInfoScreen";

const items = [
  { id: "store", icon: Store, label: "Thông tin cửa hàng", desc: "Tên, địa chỉ, liên hệ" },
  { id: "notifications", icon: Bell, label: "Thông báo", desc: "Cảnh báo tồn kho, đơn hàng mới" },
  { id: "security", icon: Shield, label: "Bảo mật", desc: "Mật khẩu, quyền truy cập" },
];

const SettingsScreen = () => {
  const [subScreen, setSubScreen] = useState<string | null>(null);

  if (subScreen === "store") {
    return <StoreInfoScreen onBack={() => setSubScreen(null)} />;
  }

  if (subScreen === "notifications") {
    return <NotificationSettings onBack={() => setSubScreen(null)} />;
  }

  return (
    <div className="animate-fade-up space-y-5">
      <h1 className="text-xl font-bold tracking-tight">Cài đặt</h1>

      {/* Profile card */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
          TB
        </div>
        <div>
          <p className="text-sm font-semibold">THE BOX Admin</p>
          <p className="text-xs text-muted-foreground">admin@thebox.vn</p>
        </div>
      </div>

      {/* Menu */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setSubScreen(item.id)}
            className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted ${
              i < items.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <item.icon className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-semibold text-destructive active:scale-[0.98] transition-transform">
        <LogOut className="h-4 w-4" />
        Đăng xuất
      </button>
    </div>
  );
};

export default SettingsScreen;
