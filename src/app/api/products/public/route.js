import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    await connectToDatabase();

    // ✅ Security check
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.PUBLIC_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ✅ Only select specific fields for safety
    const products = await Product.find({}, "title category price stock thumbnail").lean();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Public Products GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}