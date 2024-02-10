"use client";

import { CiLock, CiMail } from "react-icons/ci";
import { useState } from "react";
import { Providers } from "./Providers";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks";
import { handleLogin, handleLoginParams } from "@/app/utils/login-page/index";

export default function LoginForm() {
  const [loginParams, setLoginParams] = useState<loginParams>({
    email: "",
    password: "",
  });
  const [isValid, setIsValid] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <article className="login-content">
      <h1>Socilize</h1>
      <h2>Log in to your Account</h2>
      <form
        className="login-form"
        onChange={(e) =>
          handleLoginParams(e, setLoginParams, loginParams, setIsValid)
        }
      >
        <div className="input-field">
          <CiMail />
          <input type="text" id="email" placeholder="Email" />
        </div>
        <div className="input-field">
          <CiLock />
          <input type="password" id="password" placeholder="Password" />
        </div>
        <div className="forgot-password-container">
          <button className="forgot-password-button">Forgot Password?</button>
        </div>
        <button
          className={`${isValid ? "login-button" : "invalid-login-button"}`}
          onClick={(e) => handleLogin(e, loginParams, dispatch, router)}
          disabled={!isValid}
        >
          Log in
        </button>
        <p className="login-method-paragraph">
          Or Login using diffrent method :
        </p>
        <Providers />
      </form>
    </article>
  );
}

type loginParams = {
  email: string;
  password: string;
};
