import { useState } from "react";
import { Search, Plus, Package } from "lucide-react";
import { products, formatCurrency, type Product } from "@/data/dummy-data";

const categories = ["Tất cả", "Áo", "Quần", "Phụ kiện"];

const ProductList = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Tất cả" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="animate-fade-up space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Sản phẩm</h1>
        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm active:scale-95 transition-transform">
          <Plus className="h-4 w-4" />
          Thêm
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors active:scale-95 ${
              category === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product list */}
      <div className="space-y-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Package className="h-10 w-10" />
            <p className="text-sm">Không tìm thấy sản phẩm</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => (
  <div className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
    <img
      src={product.image}
      alt={product.name}
      className="h-20 w-20 shrink-0 rounded-lg object-cover"
      loading="lazy"
    />
    <div className="flex flex-1 flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold leading-tight">{product.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {product.size} · {product.color}
        </p>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-sm font-bold text-primary">{formatCurrency(product.price)}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            product.stock === 0
              ? "bg-destructive/15 text-destructive"
              : product.stock <= 3
              ? "bg-warning/15 text-warning"
              : "bg-success/15 text-success"
          }`}
        >
          {product.stock === 0 ? "Hết hàng" : `Còn ${product.stock}`}
        </span>
      </div>
    </div>
  </div>
);

export default ProductList;
