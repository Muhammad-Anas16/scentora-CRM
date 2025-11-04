import helperFunction from "@/lib/helperFunction";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { username, email, password } = await req.json();

        // Input validation
        if (!username || !email || !password) {
            return helperFunction(400, null, true, "All fields are required");
        }

        if (username.trim().length < 3) {
            return helperFunction(400, null, true, "Username must be at least 3 characters");
        }

        if (password.length < 6) {
            return helperFunction(400, null, true, "Password must be at least 6 characters");
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return helperFunction(400, null, true, "Invalid email format");
        }

        if (!process.env.SALT) {
            return helperFunction(500, null, true, "Server configuration error");
        }

        await connectToDatabase();
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return helperFunction(400, null, true, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
        const newUser = await User.create({
            username: username.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        return helperFunction(201, { user: userWithoutPassword }, false, "User registered successfully");
    } catch (error) {
        console.error("Registration error:", error);
        // Don't expose internal error messages to client
        if (error.code === 11000) {
            return helperFunction(400, null, true, "Email already exists");
        }
        return helperFunction(500, null, true, "Internal server error");
    }
}