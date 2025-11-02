"use client";

import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/Redux/features/productsSlice/productsSlice";

const ProductComp = () => {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
            <Plus size={16} />
            <span className="text-sm">
              Add New Product
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {/* <div className="mb-4">
        <input
          type="text"
          placeholder="Search products by name or category..."
          className="border rounded-md w-full md:w-1/3 p-2 focus:ring-2 focus:ring-amber-400 outline-none"
        />
      </div> */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
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
            {products.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">{item.id}</td>
                <td className="px-6 py-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                </td>
                <td className="px-6 py-4">{item.title}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">${item.price}</td>
                <td className="px-6 py-4">{item.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductComp;
