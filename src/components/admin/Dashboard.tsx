import { TrendingUp, ShoppingBag, AlertTriangle, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { weeklyRevenue, formatCurrency, products, orders } from "@/data/dummy-data";

const Dashboard = () => {
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 3).length;

  const metrics = [
    {
      label: "Doanh thu",
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      change: "+12.5%",
      accent: "bg-primary/10 text-primary",
    },
    {
      label: "Đơn hàng",
      value: orders.length.toString(),
      icon: ShoppingBag,
      change: "+3",
      accent: "bg-info/10 text-info",
    },
    {
      label: "Cảnh báo hết hàng",
      value: lowStock.toString(),
      icon: AlertTriangle,
      change: `${lowStock} sản phẩm`,
      accent: "bg-warning/10 text-warning",
    },
  ];

  return (
    <div className="animate-fade-up space-y-5">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Xin chào, Admin</p>
        <h1 className="text-xl font-bold tracking-tight">THE BOX — Tổng quan</h1>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${m.accent}`}>
              <m.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
              <p className="text-lg font-bold leading-tight">{m.value}</p>
            </div>
            <span className="flex items-center gap-0.5 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
              <ArrowUpRight className="h-3 w-3" />
              {m.change}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold">Doanh thu tuần này</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyRevenue} barSize={24}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis hide />
            <Tooltip
              formatter={(v: number) => formatCurrency(v)}
              contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid hsl(220 13% 90%)" }}
            />
            <Bar dataKey="revenue" fill="hsl(220 65% 18%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
