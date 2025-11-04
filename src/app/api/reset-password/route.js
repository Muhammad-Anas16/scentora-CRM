import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import helperFunction from "@/lib/helperFunction";

export async function POST(req) {
    try {
        const { newPassword, token } = await req.json();

        // Input validation
        if (!newPassword || !token) {
            return helperFunction(400, null, true, "Password and token are required");
        }

        if (newPassword.length < 6) {
            return helperFunction(400, null, true, "Password must be at least 6 characters");
        }

        if (!process.env.SALT) {
            return helperFunction(500, null, true, "Server configuration error");
        }

        await connectToDatabase();

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return helperFunction(400, null, true, "Invalid or expired token");
        }

        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT));

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return helperFunction(200, null, false, "Password reset successfully");

    } catch (error) {
        console.error("Reset password error:", error);
        return helperFunction(500, null, true, "Internal server error");
    }
}