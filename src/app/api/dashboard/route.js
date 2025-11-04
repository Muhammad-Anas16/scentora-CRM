import { connectToDatabase } from "@/lib/mongodb";
import helperFunction from "@/lib/helperFunction";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import Opportunity from "@/models/Opportunity";

export async function GET() {
  try {
    await connectToDatabase();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const [
      totalOrders,
      deliveredOrders,
      monthlyRevenueAgg,
      aovAgg,
      totalCustomers,
      newCustomersThisWeek,
      pipelineAgg,
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ status: "Delivered" }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, revenue: { $sum: "$amount" } } },
      ]),
      Order.aggregate([
        { $group: { _id: null, avg: { $avg: "$amount" } } },
      ]),
      Customer.countDocuments({}),
      Customer.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Opportunity.aggregate([
        { $group: { _id: "$stage", total: { $sum: 1 }, value: { $sum: "$value" } } },
      ]),
    ]);

    const monthlyRevenue = monthlyRevenueAgg[0]?.revenue || 0;
    const avgOrderValue = aovAgg[0]?.avg || 0;

    return helperFunction(
      200,
      {
        kpis: {
          totalOrders,
          deliveredOrders,
          monthlyRevenue,
          avgOrderValue,
          totalCustomers,
          newCustomersThisWeek,
        },
        pipeline: pipelineAgg,
      },
      false,
      "Dashboard computed"
    );
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}


