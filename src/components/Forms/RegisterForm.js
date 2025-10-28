"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "./schema";
import { useRouter } from "next/navigation";

const RegisterForm = () => {

    const router = useRouter();
  
    const handleClick = () => {
      router.push("/auth/login");
    };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (data) => {
    console.log("✅ Form Data:", data);
  };

  return (
    <div 
    // className="h-screen w-full flex items-center justify-center bg-[url('/background.avif')] bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0"></div>
      <div className="relative z-10 bg-white/90 rounded-xl shadow-xl w-full max-w-md p-8 text-center">
        <h2 className="text-2xl font-serif text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-500 text-sm mb-6">
          Please fill the form to register.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              {...register("username")}
              className={`w-full mt-1 px-3 py-2 text-black border rounded-md bg-gray-100 focus:outline-none focus:ring-2 ${errors.username
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-gray-400"
                }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="your@example.com"
              {...register("email")}
              className={`w-full mt-1 px-3 py-2 text-black border rounded-md bg-gray-100 focus:outline-none focus:ring-2 ${errors.email
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-gray-400"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full mt-1 px-3 py-2 text-black border rounded-md bg-gray-100 focus:outline-none focus:ring-2 ${errors.password
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-gray-400"
                }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-900 transition"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <span onClick={handleClick} className="font-medium text-gray-800 hover:underline cursor-pointer">
            Login
          </span>
        </p>
      </div>
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 flex items-center space-x-1 z-10">
        <span>Made with</span>
        <span className="text-purple-600 font-bold">❤</span>
      </div>
    </div>
  );
};

export default RegisterForm;
