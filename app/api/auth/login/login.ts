"use server";

import mongoose from "mongoose";
import { connectToDB } from "@/lib/dbConnect";
import LoginModel from "@/models/auth/login";
import { NextResponse } from "next/server";
import { Jwt, sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async function POST(request: Request) {
  const { email, password } = await request.json();
  connectToDB();
  const user: { email: string; password: string } | null =
    await LoginModel.findOne({
      email,
    });

  if (!user) {
    return NextResponse.json(
      { message: "email or password is incorrect" },
      { status: 403 }
    );
  }

  const comparePassword: boolean = await bcrypt.compare(
    password,
    user?.password
  );

  if (comparePassword) {
    const token = sign({ user }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    NextResponse.json({ token }, { status: 200 });
  }

  if (!comparePassword) {
    NextResponse.json({ message: "email or password is incorrect" });
  }
}
