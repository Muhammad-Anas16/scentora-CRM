import { connectToDatabase } from "@/lib/mongodb";
import helperFunction from "@/lib/helperFunction";
import Activity from "@/models/Activity";
import { withRole } from "@/middleware/auth";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");
    const assignedTo = searchParams.get("assignedTo");
    const completed = searchParams.get("completed");

    const filter = {};
    if (entityType && entityId) {
      filter["relatedTo.entityType"] = entityType;
      filter["relatedTo.entityId"] = entityId;
    }
    if (assignedTo) filter.assignedTo = assignedTo;
    if (completed === "true" || completed === "false") filter.completed = completed === "true";

    const [items, total] = await Promise.all([
      Activity.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Activity.countDocuments(filter),
    ]);
    return helperFunction(200, { items, total, page, limit }, false, "Activities fetched");
  } catch (error) {
    console.error("Activities GET error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}

export const POST = withRole(async (req) => {
  try {
    await connectToDatabase();
    const body = await req.json();
    const created = await Activity.create(body);
    return helperFunction(201, { item: created }, false, "Activity created");
  } catch (error) {
    console.error("Activity POST error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}, ["Admin", "Manager", "Sales Rep"]);


