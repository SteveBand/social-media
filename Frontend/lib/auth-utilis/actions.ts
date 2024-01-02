import { redirect } from "next/navigation";
import { loginSchema } from "./authSchemas";
import { Profile, RequestInternal } from "next-auth";
import { connectToDB } from "../dbConnect";

import { CredentialInput } from "next-auth/providers/credentials";
import UserModel from "@/models/user";

async function profileSignIn(profile: any) {
  try {
    if (!profile || !profile.email) return false;
    const { email, name, id, avatar_url, bio } = profile;

    await connectToDB();
    const user = await UserModel.findOne({ email });
    if (user) return true;
    const newUser = new UserModel({
      email,
      name: profile.name || "",
      avatar_url: profile.avatar_url || "avatar_url",
      bio: profile.bio || "",
    });

    console.log("New user Object: ", newUser);
    await newUser.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function credentialsSignIn(credentials: CredentialInput | undefined) {
  let isSignIn;
  try {
    if (credentials && "email" in credentials) {
      const { email } = credentials;
      await connectToDB();
      const user = await UserModel.findOne({ email });
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
  if (validation.error === undefined) {
    return null;
  }
  if (validation.error !== undefined) {
    return true;
  }
}

export async function fetchUser(email: string) {
  await connectToDB();
  const user = await UserModel.findOne({ email });
  const newUser = await user.toObject();
  return newUser;
}

export async function fetchProfileImage(parentId: string) {
  const profileImage = await UserModel.find({ email: parentId }).select({
    avatar_url: 1,
    _id: 0,
  });

  if (profileImage) {
    console.log(profileImage);
    return profileImage.pop();
  }
}
