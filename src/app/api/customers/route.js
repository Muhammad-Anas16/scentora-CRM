import { connectToDatabase } from "@/lib/mongodb";
import helperFunction from "@/lib/helperFunction";
import Customer from "@/models/Customer";
import { withRole } from "@/middleware/auth";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const q = (searchParams.get("q") || "").trim();
    const stage = searchParams.get("stage");

    const filter = {};
    if (q) {
      filter.$text = { $search: q };
    }
    if (stage) {
      filter.lifecycleStage = stage;
    }

    const [items, total] = await Promise.all([
      Customer.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Customer.countDocuments(filter),
    ]);

    return helperFunction(200, { items, total, page, limit }, false, "Customers fetched");
  } catch (error) {
    console.error("Customers GET error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}

export const POST = withRole(async (req) => {
  try {
    await connectToDatabase();
    const body = await req.json();
    const created = await Customer.create(body);
    return helperFunction(201, { item: created }, false, "Customer created");
  } catch (error) {
    console.error("Customer POST error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}, ["Admin", "Manager", "Sales Rep"]);


