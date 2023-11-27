"use server";

import { redirect } from "next/navigation";
import { LoginParams, SignupParams } from "./authTypes";
import { setCookie } from "cookies-next";

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
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const value = await res.json();
  return value;
}

type LoginResponse = {
  firstName: string;
  lastName: string;
  id: string;
  token: string;
};
