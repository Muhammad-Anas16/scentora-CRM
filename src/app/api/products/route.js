import { connectToDatabase } from "@/lib/mongodb";
import helperFunction from "@/lib/helperFunction";
import Product from "@/models/Product";
import { withRole } from "@/middleware/auth";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const q = (searchParams.get("q") || "").trim();
    const category = searchParams.get("category");

    const filter = {};
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);
    return helperFunction(200, { items, total, page, limit }, false, "Products fetched");
  } catch (error) {
    console.error("Products GET error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}

export const POST = withRole(async (req) => {
  try {
    await connectToDatabase();
    const body = await req.json();
    const created = await Product.create(body);
    return helperFunction(201, { item: created }, false, "Product created");
  } catch (error) {
    console.error("Product POST error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}, ["Admin", "Manager"]);


