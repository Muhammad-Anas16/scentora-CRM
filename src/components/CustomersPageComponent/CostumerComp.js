"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "@/yupSchema/userSchema";

const CostumerComp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const onSubmit = (data) => {
    console.log("✅ Validated User Data:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-6"
    >
      <h2 className="text-xl font-semibold">Add User</h2>

      {/* --- Name Fields --- */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            {...register("firstName")}
            className="border rounded-md w-full p-2 focus:ring-2 focus:ring-amber-400 outline-none"
            placeholder="Enter first name"
          />
          <p className="text-red-500 text-xs mt-1">{errors.firstName?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            {...register("lastName")}
            className="border rounded-md w-full p-2 focus:ring-2 focus:ring-amber-400 outline-none"
            placeholder="Enter last name"
          />
          <p className="text-red-500 text-xs mt-1">{errors.lastName?.message}</p>
        </div>
      </div>

      {/* --- Contact Info --- */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          {...register("email")}
          type="email"
          className="border rounded-md w-full p-2 focus:ring-2 focus:ring-amber-400 outline-none"
          placeholder="example@email.com"
        />
        <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          {...register("phone")}
          className="border rounded-md w-full p-2 focus:ring-2 focus:ring-amber-400 outline-none"
          placeholder="+1 234-567-890"
        />
        <p className="text-red-500 text-xs mt-1">{errors.phone?.message}</p>
      </div>

      {/* --- Optional Age --- */}
      <div>
        <label className="block text-sm font-medium mb-1">Age</label>
        <input
          {...register("age")}
          type="number"
          className="border rounded-md w-full p-2 focus:ring-2 focus:ring-amber-400 outline-none"
          placeholder="Enter age"
        />
        <p className="text-red-500 text-xs mt-1">{errors.age?.message}</p>
      </div>

      {/* --- Role --- */}
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <input
          {...register("role")}
          className="border rounded-md w-full p-2 focus:ring-2 focus:ring-amber-400 outline-none"
          placeholder="e.g. admin or customer"
        />
        <p className="text-red-500 text-xs mt-1">{errors.role?.message}</p>
      </div>

      {/* --- Address Section --- */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-2">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              {...register("address.address")}
              className="border rounded-md w-full p-2 focus:ring-2 focus:ring-amber-400 outline-none"
              placeholder="123 Main Street"
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.address?.address?.message}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              {...register("address.city")}
              className="border rounded-md w-full p-2 focus:ring-2 focus:ring-amber-400 outline-none"
              placeholder="City"
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.address?.city?.message}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              {...register("address.country")}
              className="border rounded-md w-full p-2 focus:ring-2 focus:ring-amber-400 outline-none"
              placeholder="Country"
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.address?.country?.message}
            </p>
          </div>
        </div>
      </div>

      {/* --- Submit Button --- */}
      <button
        type="submit"
        className="bg-gray-900 text-white px-5 py-2.5 rounded-md hover:bg-gray-800 transition-colors"
      >
        Save User
      </button>
    </form>
  );
}

export default CostumerComp;