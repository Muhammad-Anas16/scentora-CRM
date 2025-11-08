import helperFunction from "@/lib/helperFunction";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import { withRole } from "@/middleware/auth";

const VALID_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const status = searchParams.get("status");
        const customer = searchParams.get("customer");

        const filter = {};
        if (status) filter.status = status;
        if (customer) filter.customer = customer;

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate("customer")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Order.countDocuments(filter),
        ]);
        return helperFunction(200, { items: orders, total, page, limit }, false, "Orders fetched successfully");
    } catch (error) {
        console.error("Get orders error:", error);
        return helperFunction(500, null, true, "Internal server error");
    }
}

export const POST = withRole(async (req) => {
    try {
        const { customerId, product, amount, status, orderDate, deliveryDate, opportunity } = await req.json();

        if (!customerId || !product || typeof amount !== "number") {
            return helperFunction(400, null, true, "customerId, product, and amount are required");
        }
        if (amount <= 0) {
            return helperFunction(400, null, true, "Amount must be a positive number");
        }
        if (status && !VALID_STATUSES.includes(status)) {
            return helperFunction(400, null, true, `Status must be one of: ${VALID_STATUSES.join(", ")}`);
        }

        await connectToDatabase();

        const customerDoc = await Customer.findById(customerId);
        if (!customerDoc) return helperFunction(404, null, true, "Customer not found");

        const newOrder = await Order.create({
            customer: customerId,
            product: product.trim(),
            amount,
            status: status || "Pending",
            orderDate: orderDate ? new Date(orderDate) : undefined,
            deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
            opportunity: opportunity || undefined,
            createdBy: req.auth?.userId || undefined,
        });

        // Update customer analytics
        customerDoc.totalOrderValue = (customerDoc.totalOrderValue || 0) + amount;
        customerDoc.orderCount = (customerDoc.orderCount || 0) + 1;
        customerDoc.lastOrderDate = new Date();
        await customerDoc.save();

        return helperFunction(201, { order: newOrder }, false, "Order created successfully");
    } catch (error) {
        console.error("Create order error:", error);
        return helperFunction(500, null, true, "Internal server error");
    }
}, ["Admin", "Manager", "Sales Rep"]);

export const PUT = withRole(async (req) => {
    try {
        const { orderId, status } = await req.json();

        if (!orderId) {
            return helperFunction(400, null, true, "Order ID is required");
        }
        if (!status) {
            return helperFunction(400, null, true, "Status is required");
        }
        if (!VALID_STATUSES.includes(status)) {
            return helperFunction(400, null, true, `Status must be one of: ${VALID_STATUSES.join(", ")}`);
        }

        await connectToDatabase();
        const order = await Order.findById(orderId);
        if (!order) {
            return helperFunction(404, null, true, "Order not found");
        }
        order.status = status;
        await order.save();
        return helperFunction(200, { order }, false, "Order updated successfully");
    } catch (error) {
        console.error("Update order error:", error);
        if (error.name === "CastError") {
            return helperFunction(400, null, true, "Invalid order ID format");
        }
        return helperFunction(500, null, true, "Internal server error");
    }
}, ["Admin", "Manager"]);

export const DELETE = withRole(async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
            return helperFunction(400, null, true, "Order ID is required");
        }

        await connectToDatabase();
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return helperFunction(404, null, true, "Order not found");
        }
        return helperFunction(200, null, false, "Order deleted successfully");
    } catch (error) {
        console.error("Delete order error:", error);
        if (error.name === "CastError") {
            return helperFunction(400, null, true, "Invalid order ID format");
        }
        return helperFunction(500, null, true, "Internal server error");
    }
}, ["Admin", "Manager"]);