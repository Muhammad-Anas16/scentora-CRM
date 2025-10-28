import helperFunction from "@/lib/helperFunction";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return helperFunction(404, null, true, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return helperFunction(400, null, true, "Invalid credentials");
    }

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET
    );

    const { password: _, ...userWithoutPassword } = existingUser.toObject();

    return helperFunction(200, { user: userWithoutPassword, token }, false, "Login successful");
  } catch (error) {
    return helperFunction(500, null, true, "Internal server error");
  }
}