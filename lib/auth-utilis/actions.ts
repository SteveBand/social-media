"use server";

import { SignupParams } from "./authTypes";

export async function signupFunc(params: Partial<SignupParams>) {
  await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
}
