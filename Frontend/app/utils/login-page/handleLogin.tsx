import { logIn } from "@/redux/features/auth-slice";
import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { serverUrl } from "../common";

// Login function takes a loginParams state from the component and sending a Request to the server
// If status is 200 and the user is confirmed and authorized then it updates a Redux state using "dispatch(login)"
// then it navigates the user to the dashboard page (feed-page)

export async function handleLogin(
  e: React.FormEvent,
  loginParams: { email: string; password: string },
  dispatch: dispatch,
  router: AppRouterInstance
) {
  e.preventDefault();

  const { email, password } = loginParams;

  try {
    const res = await fetch(`${serverUrl}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(logIn({ status: "authenticated", user_info: data }));
      router.push("/");
    }
  } catch (err) {
    console.log("An error occured while trying to login", err);
  }
}

type dispatch = ThunkDispatch<
  {
    userReducer: InitialState;
    loginReducer: InitialState;
    communityMembersReducer: InitialState;
  },
  undefined,
  AnyAction
> &
  Dispatch<any>;

type InitialState = {
  user_info: {
    name: string;
    _id: string;
    email: string;
    avatar_url: string;
    admin?: boolean;
  };
  status: "authenticated" | "unauthenticated";
};
