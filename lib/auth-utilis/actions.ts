import { redirect } from "next/navigation";
import { LoginParams, SignupParams } from "./authTypes";
import { loginSchema } from "./authSchemas";
import { Profile, RequestInternal } from "next-auth";
import { connectToDB } from "../dbConnect";
import LoginModel from "@/models/login";

import SignupModel from "@/models/signup";
import { CredentialInput } from "next-auth/providers/credentials";
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

export async function profileSignIn(profile: Profile | undefined) {
  let isSignIn;
  try {
    if (profile) {
      const { email } = profile;
      connectToDB();
      const user = await LoginModel.findOne({ email });
      if (user) {
        isSignIn = true;
      } else {
        const newUser = {
          email,
          name: profile.name,
        };
        await new SignupModel(newUser).save();
        isSignIn = true;
      }
    }
    return isSignIn;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function credentialsSignIn(
  credentials: CredentialInput | undefined
) {
  let isSignIn;
  try {
    if (credentials && "email" in credentials) {
      const { email } = credentials;
      connectToDB();
      const user = await LoginModel.findOne({ email });
      if (user) {
        isSignIn = true;
      } else {
        isSignIn = false;
        redirect("/auth/signup");
      }
    }
    return isSignIn;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function signInFunc(
  profile: Profile | undefined,
  credentials: CredentialInput | undefined
) {
  if (profile) {
    return await profileSignIn(profile);
  }

  if (credentials) {
    return await credentialsSignIn(credentials);
  }
}

export async function validateCredentials(
  req: Pick<RequestInternal, "method" | "headers" | "body" | "query">
) {
  const userObj = req.body;
  const validation = loginSchema.validate(userObj, { abortEarly: true });
  if (validation.error !== undefined) {
    return false;
  }
}

export async function fetchUser(
  req: Pick<RequestInternal, "method" | "headers" | "body" | "query">
) {
  if (!req.body) {
    return false;
  }
  const { email } = req.body;
  connectToDB();
  const user = await LoginModel.findOne({ email });
  if (user) {
    return user;
  } else {
    return false;
  }
}
