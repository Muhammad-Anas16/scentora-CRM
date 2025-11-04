import { connectToDatabase } from "@/lib/mongodb";
import helperFunction from "@/lib/helperFunction";
import Opportunity from "@/models/Opportunity";
import { withRole } from "@/middleware/auth";

export async function GET(_req, { params }) {
  try {
    await connectToDatabase();
    const item = await Opportunity.findById(params.id)
      .populate("customer")
      .populate("owner")
      .lean();
    if (!item) return helperFunction(404, null, true, "Opportunity not found");
    return helperFunction(200, { item }, false, "Opportunity fetched");
  } catch (error) {
    console.error("Opportunity GET by id error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}

export const PUT = withRole(async (req, { params }) => {
  try {
    await connectToDatabase();
    const body = await req.json();
    const updated = await Opportunity.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return helperFunction(404, null, true, "Opportunity not found");
    return helperFunction(200, { item: updated }, false, "Opportunity updated");
  } catch (error) {
    console.error("Opportunity PUT error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}, ["Admin", "Manager", "Sales Rep"]);

export const DELETE = withRole(async (_req, { params }) => {
  try {
    await connectToDatabase();
    const deleted = await Opportunity.findByIdAndDelete(params.id);
    if (!deleted) return helperFunction(404, null, true, "Opportunity not found");
    return helperFunction(200, null, false, "Opportunity deleted");
  } catch (error) {
    console.error("Opportunity DELETE error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}, ["Admin", "Manager"]);


