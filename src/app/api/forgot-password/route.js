import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";
import helperFunction from "@/lib/helperFunction";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { email } = await req.json();
        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return helperFunction(404, null, true, "User not found");
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

        console.log("🔗 Reset Link:", resetUrl);

        return helperFunction(200, { resetUrl }, false, "Password reset link generated");

    } catch (error) {
        return helperFunction(500, null, true, "Internal server error");
    }
}