"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/Redux/features/productsSlice/productsSlice";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ProductForm from "@/components/Forms/ProductForm";
import { demoProducts } from "@/data/demoData";

const ProductComp = () => {
  const dispatch = useDispatch();

  const { products, loading, error, page, limit, total } = useSelector((state) => state.products);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchProducts({ page, limit, q: query }));
  }, [dispatch, page, limit, query]);

  const filteredDemoProducts = useMemo(() => {
    if (!query) return demoProducts;
    const lower = query.toLowerCase();
    return demoProducts.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        (item.category || "").toLowerCase().includes(lower)
    );
  }, [query]);

  const shouldUseDemo =
    !!error || (!loading && !error && !query && (products?.length ?? 0) === 0);

  const displayProducts = shouldUseDemo ? filteredDemoProducts : products;
  const displayTotal = shouldUseDemo ? filteredDemoProducts.length : total;

  const formatCurrency = (value) =>
    typeof value === "number"
      ? new Intl.NumberFormat("en-PK", {
          style: "currency",
          currency: "PKR",
          minimumFractionDigits: 0,
        }).format(value)
      : value;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Product Inventory</h1>
          {/* <p className="text-gray-500 text-sm">
            Manage your perfume products, including adding, editing, and deleting items.
          </p> */}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Sheet>
            <SheetTrigger className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
              <Plus size={16} />
              <span className="text-sm">Add New Product</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Add New Product</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ProductForm 
                  onSuccess={() => {
                    dispatch(fetchProducts({ page, limit, q: query }));
                  }}
                  onClose={() => {
                    const closeBtn = document.querySelector('[data-slot="sheet-close"]');
                    if (closeBtn) closeBtn.click();
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {shouldUseDemo && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          Showing demo products
        </div>
      )}
      {error && !shouldUseDemo && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Search Bar - wired to backend */}
      <div className="rounded-xl bg-white shadow">
        <div className="p-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product title or category"
            className="w-full rounded-md border p-2 outline-none focus:ring-2 focus:ring-amber-400 md:w-72"
          />
        </div>
        <div className="-mx-4 overflow-x-auto md:mx-0">
          <table className="min-w-full text-sm text-left">
            <thead className="border-b bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
              </tr>
            </thead>
            <tbody>
            {loading && !shouldUseDemo && (
                <tr><td className="px-6 py-8 text-center text-gray-500" colSpan={6}>Loading products...</td></tr>
              )}
            {!loading && displayProducts.length === 0 && (
                <tr><td className="px-6 py-8 text-center text-gray-500" colSpan={6}>No products found. Create your first product!</td></tr>
              )}
            {!loading && displayProducts.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-xs">{item._id?.slice(-8) || "N/A"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                    <img
                      src={item.thumbnail || ""}
                      alt={item.title || "Product"}
                      className={`h-10 w-10 rounded-md object-cover ${item.thumbnail ? "" : "hidden"}`}
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.classList.add("hidden");
                        const fallback = img.nextElementSibling;
                        if (fallback) {
                          fallback.classList.remove("hidden");
                        }
                      }}
                    />
                    <div className={`flex h-10 w-10 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500 ${item.thumbnail ? "hidden" : ""}`}>
                        No Image
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{item.title}</td>
                  <td className="px-6 py-4 text-gray-600">{item.category || "Uncategorized"}</td>
                <td className="px-6 py-4 font-semibold">{formatCurrency(item.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.stock ?? 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="text-sm text-gray-600">Total: {displayTotal}</div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page <= 1 || shouldUseDemo}
              onClick={() => dispatch(fetchProducts({ page: page - 1, limit, q: query }))}
            >Previous</button>
            <span className="text-sm font-medium">{page}</span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={(page * limit) >= displayTotal || shouldUseDemo}
              onClick={() => dispatch(fetchProducts({ page: page + 1, limit, q: query }))}
            >Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductComp;
