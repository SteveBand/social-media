import mongoose from "mongoose";
import { connectToDB } from "@/lib/dbConnect";
import LoginModel from "@/models/auth/login";

export default async function POST(request: Request) {
  const { email, password } = await request.json();
  connectToDB();
  const user = LoginModel.findOne({ email });
}
