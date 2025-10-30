"use client";

import React from "react";
import { Plus, Filter, Download, Edit, Trash2 } from "lucide-react";

const ProductComp = () => {
  const products = [
    {
      id: "P001",
      image: "https://i.ibb.co/qymw6Pg/perfume1.png",
      name: "Radiant Bloom",
      category: "Floral",
      price: "$85.00",
      stock: 150,
    },
    {
      id: "P002",
      image: "https://i.ibb.co/fFpKMGz/perfume2.png",
      name: "Deep Forest",
      category: "Woody",
      price: "$92.50",
      stock: 80,
    },
    {
      id: "P003",
      image: "https://i.ibb.co/6FvyL8H/perfume3.png",
      name: "Ocean Breeze",
      category: "Aquatic",
      price: "$78.00",
      stock: 200,
    },
    {
      id: "P004",
      image: "https://i.ibb.co/Z1r7mM9/perfume4.png",
      name: "Golden Hour",
      category: "Citrus",
      price: "$70.00",
      stock: 120,
    },
    {
      id: "P005",
      image: "https://i.ibb.co/VQqbJyf/perfume5.png",
      name: "Midnight Musk",
      category: "Musk",
      price: "$99.99",
      stock: 60,
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Product Inventory</h1>
          <p className="text-gray-500 text-sm">
            Manage your perfume products, including adding, editing, and deleting items.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
            <Plus size={16} />
            Add New Product
          </button>
          <button className="flex items-center gap-2 border px-4 py-2 rounded-md hover:bg-gray-100">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 border px-4 py-2 rounded-md hover:bg-gray-100">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products by name or category..."
          className="border rounded-md w-full md:w-1/3 p-2 focus:ring-2 focus:ring-amber-400 outline-none"
        />
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Product ID</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">{item.id}</td>
                <td className="px-6 py-4">
                  <img
                    src={item.image || "https://gembah.com/wp-content/uploads/2022/07/new-product-design.jpeg"}
                    alt={item.name || "Product Image"}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                </td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{item.price}</td>
                <td className="px-6 py-4">{item.stock}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <button className="text-gray-500 hover:text-blue-600">
                    <Edit size={16} />
                  </button>
                  <button className="text-gray-500 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductComp;
