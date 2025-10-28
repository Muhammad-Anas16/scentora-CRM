import helperFunction from "@/lib/helperFunction";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req) {
    try {
        await connectToDatabase();
        const orders = await Order.find().sort({ createdAt: -1 });
        return helperFunction(200, { orders }, false, "Orders fetched successfully");
    } catch (error) {
        return helperFunction(500, null, true, "Internal server error");
    }
}

export async function POST(req) {
    try {
        const { customerName, product, amount, status } = await req.json();
        await connectToDatabase();

        const newOrder = await Order.create({
            customerName,
            product,
            amount,
            status,
        });
        return helperFunction(201, { order: newOrder }, false, "Order created successfully");
    } catch (error) {
        return helperFunction(500, null, true, "Internal server error");
    }
}

export async function PUT(req) {
    try {
        const { orderId, status } = await req.json();
        await connectToDatabase();
        const order = await Order.findById(orderId);
        if (!order) {
            return helperFunction(404, null, true, "Order not found");
        }
        order.status = status;
        await order.save();
        return helperFunction(200, { order }, false, "Order updated successfully");
    } catch (error) {
        return helperFunction(500, null, true, "Internal server error");
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get("orderId");
        await connectToDatabase();
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return helperFunction(404, null, true, "Order not found");
        }
        return helperFunction(200, null, false, "Order deleted successfully");
    } catch (error) {
        return helperFunction(500, null, true, "Internal server error");
    }
}