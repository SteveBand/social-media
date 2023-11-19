import bcrypt from "bcrypt";
import { connectToDB } from "@/lib/dbConnect";
import SignupModel from "@/models/auth/signup";
import { signupSchema } from "@/lib/auth-utilis/authSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  const params = await request.json();
  const validation = signupSchema.validate(params, { abortEarly: true });

  if (validation.error !== undefined) {
    console.log(validation.error);
    return NextResponse.json({ message: "validation shit" }, { status: 400 });
  }

  connectToDB();

  const existingUser = await SignupModel.findOne({ email: params.email });

  if (existingUser) {
    return NextResponse.json(
      {
        message: "User already exists with this Email choose another",
      },
      { status: 403 }
    );
  }

  params.password = await bcrypt.hash(params.password, 10);

  const userObj = await new SignupModel(params);
  await userObj.save();
  return NextResponse.json(
    { message: "User created successfully" },
    { status: 200 }
  );
}
