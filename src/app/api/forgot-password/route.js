import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";
import helperFunction from "@/lib/helperFunction";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { email } = await req.json();

        // Input validation
        if (!email) {
            return helperFunction(400, null, true, "Email is required");
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return helperFunction(400, null, true, "Invalid email format");
        }

        await connectToDatabase();

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        // Don't reveal if user exists for security reasons
        if (!user) {
            return helperFunction(200, { resetUrl: null }, false, "If the email exists, a reset link has been sent");
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

        // In production, send email instead of logging
        console.log("🔗 Reset Link:", resetUrl);

        return helperFunction(200, { resetUrl }, false, "If the email exists, a reset link has been sent");

    } catch (error) {
        console.error("Forgot password error:", error);
        return helperFunction(500, null, true, "Internal server error");
    }
}