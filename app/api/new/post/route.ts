"use server";
import { PostSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { connectToDB } from "@/lib/dbConnect";
import PostModel from "@/models/post";
export async function POST(request: Request) {
  const params = await request.json();
  const token = request.headers.get("bearer-token");
  if (!token) {
    return NextResponse.json({ error: "Token missing" });
  }
  verify(token, process.env.JWT_SECRET as string, function (error, decoded) {
    if (error) {
      return NextResponse.json({ error });
    }
  });
  const validation = PostSchema.validate(params, { abortEarly: true });
  if (validation.error !== undefined) {
    return NextResponse.json({ error: "Content validation error" });
  }

  connectToDB();

  const post = await new PostModel(params);
  await post.save();
  return NextResponse.json({ message: "Post uploaded successfully" });
}
