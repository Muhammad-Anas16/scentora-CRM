import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { newPassword, token } = await req.json();
        await connectToDatabase();

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return helperFunction(400, null, true, "Invalid or expired token");
        }

        // Now I'm making reseting password functionality

        const hashedPassword = await bcrypt.hash(newPassword, process.env.SALT);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return helperFunction(200, null, false, "Password reset successfully");

    } catch (error) {
        return helperFunction(500, null, true, "Internal server error");
    }
}