import helperFunction from "@/lib/helperFunction";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { username, email, password } = await req.json();
        await connectToDatabase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return helperFunction(400, null, true, "User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        return helperFunction(201, { user: userWithoutPassword }, false, "User registered successfully");
    } catch (error) {
        return helperFunction(500, null, true, error.message);
    }
}