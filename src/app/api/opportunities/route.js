import { connectToDatabase } from "@/lib/mongodb";
import helperFunction from "@/lib/helperFunction";
import Opportunity from "@/models/Opportunity";
import { withRole } from "@/middleware/auth";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const stage = searchParams.get("stage");
    const owner = searchParams.get("owner");

    const filter = {};
    if (stage) filter.stage = stage;
    if (owner) filter.owner = owner;

    const [items, total] = await Promise.all([
      Opportunity.find(filter)
        .populate("customer")
        .populate("owner")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Opportunity.countDocuments(filter),
    ]);

    return helperFunction(200, { items, total, page, limit }, false, "Opportunities fetched");
  } catch (error) {
    console.error("Opportunities GET error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}

export const POST = withRole(async (req) => {
  try {
    await connectToDatabase();
    const body = await req.json();
    // Set owner to current user if not provided
    if (!body.owner && req.auth?.userId) {
      body.owner = req.auth.userId;
    }
    const created = await Opportunity.create(body);
    return helperFunction(201, { item: created }, false, "Opportunity created");
  } catch (error) {
    console.error("Opportunity POST error:", error);
    if (error.name === "ValidationError") {
      return helperFunction(400, null, true, error.message);
    }
    return helperFunction(500, null, true, "Internal server error");
  }
}, ["Admin", "Manager", "Sales Rep"]);


