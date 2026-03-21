import { useState } from "react";
import BottomNav from "@/components/admin/BottomNav";
import Dashboard from "@/components/admin/Dashboard";
import ProductList from "@/components/admin/ProductList";
import OrderList from "@/components/admin/OrderList";
import SettingsScreen from "@/components/admin/SettingsScreen";

const screens: Record<string, React.FC> = {
  dashboard: Dashboard,
  products: ProductList,
  orders: OrderList,
  settings: SettingsScreen,
};

const Index = () => {
  const [tab, setTab] = useState("dashboard");
  const Screen = screens[tab];

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      <main className="px-4 pb-20 pt-6">
        <Screen />
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
};

export default Index;
