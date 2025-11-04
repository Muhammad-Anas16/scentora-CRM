import { connectToDatabase } from "@/lib/mongodb";
import helperFunction from "@/lib/helperFunction";
import Customer from "@/models/Customer";
import { withRole } from "@/middleware/auth";

export async function GET(_req, { params }) {
  try {
    await connectToDatabase();
    const item = await Customer.findById(params.id).lean();
    if (!item) return helperFunction(404, null, true, "Customer not found");
    return helperFunction(200, { item }, false, "Customer fetched");
  } catch (error) {
    console.error("Customer GET by id error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}

export const PUT = withRole(async (req, { params }) => {
  try {
    await connectToDatabase();
    const body = await req.json();
    const updated = await Customer.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return helperFunction(404, null, true, "Customer not found");
    return helperFunction(200, { item: updated }, false, "Customer updated");
  } catch (error) {
    console.error("Customer PUT error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}, ["Admin", "Manager", "Sales Rep"]);

export const DELETE = withRole(async (_req, { params }) => {
  try {
    await connectToDatabase();
    const deleted = await Customer.findByIdAndDelete(params.id);
    if (!deleted) return helperFunction(404, null, true, "Customer not found");
    return helperFunction(200, null, false, "Customer deleted");
  } catch (error) {
    console.error("Customer DELETE error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}, ["Admin", "Manager"]);


