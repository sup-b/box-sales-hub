import { LayoutDashboard, Package, ClipboardList, Settings } from "lucide-react";

interface BottomNavProps {
  active: string;
  onChange: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { id: "products", label: "Sản phẩm", icon: Package },
  { id: "orders", label: "Đơn hàng", icon: ClipboardList },
  { id: "settings", label: "Cài đặt", icon: Settings },
];

const BottomNav = ({ active, onChange }: BottomNavProps) => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
    <div className="mx-auto flex max-w-lg items-stretch">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors active:scale-95 ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.8} />
            <span>{tab.label}</span>
            {isActive && (
              <span className="absolute top-0 h-[2px] w-10 rounded-b-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  </nav>
);

export default BottomNav;
