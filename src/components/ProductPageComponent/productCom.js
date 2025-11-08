"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/Redux/features/productsSlice/productsSlice";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ProductForm from "@/components/Forms/ProductForm";

const ProductComp = () => {
  const dispatch = useDispatch();

  const { products, loading, error, page, limit, total } = useSelector((state) => state.products);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchProducts({ page, limit, q: query }));
  }, [dispatch, page, limit, query]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Product Inventory</h1>
          {/* <p className="text-gray-500 text-sm">
            Manage your perfume products, including adding, editing, and deleting items.
          </p> */}
        </div>

        <div className="flex items-center gap-3">
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

      {/* Search Bar - wired to backend */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <div className="p-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product title or category"
            className="border rounded-md w-full md:w-1/3 p-2 focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>
        <table className="min-w-[90%] text-sm text-left">
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
            {loading && (
              <tr><td className="px-6 py-8 text-center text-gray-500" colSpan={6}>Loading products...</td></tr>
            )}
            {error && !loading && (
              <tr><td className="px-6 py-8 text-center text-red-600" colSpan={6}>Error: {error}</td></tr>
            )}
            {!loading && !error && products.length === 0 && (
              <tr><td className="px-6 py-8 text-center text-gray-500" colSpan={6}>No products found. Create your first product!</td></tr>
            )}
            {!loading && !error && products.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-xs">{item._id?.slice(-8) || "N/A"}</td>
                <td className="px-6 py-4">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title || "Product"}
                      className="w-10 h-10 rounded-md object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500" style={{ display: item.thumbnail ? 'none' : 'flex' }}>
                    No Image
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{item.title}</td>
                <td className="px-6 py-4 text-gray-600">{item.category || "Uncategorized"}</td>
                <td className="px-6 py-4 font-semibold">${item.price?.toFixed ? item.price.toFixed(2) : item.price || "0.00"}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.stock || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="text-sm text-gray-600">Total: {total}</div>
        <div className="space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => dispatch(fetchProducts({ page: page - 1, limit, q: query }))}
          >Previous</button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={(page * limit) >= total}
            onClick={() => dispatch(fetchProducts({ page: page + 1, limit, q: query }))}
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default ProductComp;
