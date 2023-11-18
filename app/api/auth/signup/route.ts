import bcrypt from "bcrypt";
import { connectToDB } from "@/lib/dbConnect";
import SignupModel from "@/models/auth/signup";
import { signupSchema } from "@/lib/auth-utilis/authSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, firstName, lastName, gender } = await request.json();

  const validation = signupSchema.validate(
    { email, password, firstName, lastName, gender },
    { abortEarly: true }
  );

  if (!validation.error === undefined) {
    return NextResponse.json({ message: "validation shit" }, { status: 400 });
  }

  connectToDB();

  const existingUser = await SignupModel.findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      {
        message: "User already exists with this Email choose another",
      },
      { status: 400 }
    );
  }

  const hashedPassword: string = await bcrypt.hash(password, 10);
  const userObj = new SignupModel({
    email,
    hashedPassword,
    firstName,
    lastName,
    gender,
  });
  await userObj.save();
  return NextResponse.json({ message: "Username succesfully created" });
}
