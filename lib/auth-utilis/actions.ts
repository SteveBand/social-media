"use server";

import { redirect } from "next/navigation";
import { LoginParams, SignupParams } from "./authTypes";

export async function signupFunc(params: Partial<SignupParams>) {
  const res = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (res.status === 200) {
    redirect("/login");
  }
}

export async function loginFunc(params: Partial<LoginParams>) {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (res.status === 200) {
    console.log("success");
  }
}
