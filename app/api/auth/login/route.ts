"use server";

import mongoose from "mongoose";
import { connectToDB } from "@/lib/dbConnect";
import LoginModel from "@/models/auth/login";
import { NextResponse } from "next/server";
import { Jwt, sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/auth-utilis/authSchemas";

export async function POST(request: Request) {
  const params = await request.json();
  const validation = loginSchema.validate(params, { abortEarly: true });

  if (validation.error !== undefined) {
    return NextResponse.json({ message: "wrong parameters" }, { status: 400 });
  }

  connectToDB();

  const user = await LoginModel.findOne({ email: params.email });

  if (!user) {
    return NextResponse.json({
      message: "Email or Password is incorrect, user not found",
    });
  }

  const validatePassword = await bcrypt.compare(params.password, user.password);

  if (!validatePassword) {
    return NextResponse.json({
      message: "Email or Password is incorrect, password not right",
    });
  }

  const response = NextResponse.next();

  const token = sign(params, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  response.headers.set("bearer-token", token);

  console.log(response.headers);

  return NextResponse.json(
    { messsage: "User logged in successfully" },
    { status: 200 }
  );
}
