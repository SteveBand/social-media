"use server";

import { connectToDB } from "@/lib/dbConnect";
import LoginModel from "@/models/auth/login";
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/auth-utilis/authSchemas";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const params = await request.json();
  const validation = loginSchema.validate(params, { abortEarly: true });

  if (validation.error !== undefined) {
    return NextResponse.json({ message: "wrong parameters" }, { status: 400 });
  }

  connectToDB();

  const user = await LoginModel.findOne({ email: params.email });

  if (!user) {
    return NextResponse.json(
      {
        message: "Email or Password is incorrect, email",
      },
      { status: 403 }
    );
  }

  const validatePassword = await bcrypt.compare(params.password, user.password);

  if (!validatePassword) {
    return NextResponse.json(
      {
        message: "Email or Password is incorrect, password",
      },
      { status: 403 }
    );
  }

  const token = sign(params, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  return new Response("Login success", {
    status: 200,
    headers: { "Set-Cookie": `${token}` },
  });
}
