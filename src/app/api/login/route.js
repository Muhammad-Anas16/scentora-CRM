import helperFunction from "@/lib/helperFunction";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Input validation
    if (!email || !password) {
      return helperFunction(400, null, true, "Email and password are required");
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (!existingUser) {
      return helperFunction(400, null, true, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return helperFunction(400, null, true, "Invalid credentials");
    }

    if (!process.env.JWT_SECRET) {
      return helperFunction(500, null, true, "Server configuration error");
    }

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = existingUser.toObject();

    return helperFunction(200, { user: userWithoutPassword, token }, false, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}