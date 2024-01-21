"use server";

import { connectToDB } from "@/lib/dbConnect";
// import LoginModel from "@/models/login";
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/auth-utilis/authSchemas";

// export async function POST(request: Request) {
//   const params = await request.json();
//   const validation = loginSchema.validate(params, { abortEarly: true });

//   if (validation.error !== undefined) {
//     return NextResponse.json({ message: "wrong parameters" }, { status: 400 });
//   }
//   try {
//     await connectToDB();

//     const user = await LoginModel.findOne({ email: params.email });

//     if (!user) {
//       return NextResponse.json(
//         {
//           message: "Email or Password is incorrect, email",
//         },
//         { status: 403 }
//       );
//     }

//     const validatePassword = bcrypt.compare(params.password, user.password);

//     if (!validatePassword) {
//       return NextResponse.json(
//         {
//           message: "Email or Password is incorrect, password",
//         },
//         { status: 403 }
//       );
//     }

//     const token = sign(params, process.env.JWT_SECRET as string, {
//       expiresIn: "1h",
//     });

//     const newObj = user.toObject();

//     return NextResponse.json({
//       firstName: newObj.firstName,
//       lastName: newObj.lastName,
//       id: newObj._id,
//       token,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// }
