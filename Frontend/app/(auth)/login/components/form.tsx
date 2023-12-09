"use client";

import { CiLock, CiMail } from "react-icons/ci";
import { useState, FormEvent } from "react";
import { LoginParams } from "@/lib/auth-utilis/authTypes";
import { loginSchema } from "@/lib/auth-utilis/authSchemas";
import Link from "next/link";
import { Providers } from "./Providers";
import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";

type Props = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
};

export default function LoginForm({ providers }: Props) {
  const [loginParams, setLoginParams] = useState<LoginParams>({
    email: "",
    password: "",
  });
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const event = e.target as HTMLInputElement;
    const { id, value } = event;
    const paramsObj: LoginParams = {
      ...loginParams,
      [id]: value,
    };
    setLoginParams(paramsObj);

    const validation = loginSchema.validate(paramsObj, { abortEarly: false });

    if (validation.error) {
      const error = validation.error.details.find((e) => e.context?.key === id);
      if (error) {
        setIsValid(false);
      }
    }
    if (validation.error === undefined) {
      setIsValid(true);
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { email, password } = loginParams;
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  }

  return (
    <article className="login-content">
      <h1>Socilize</h1>
      <h2>Log in to your Account</h2>
      <form className="login-form">
        <div className="input-field">
          <CiMail />
          <input
            type="text"
            id="email"
            placeholder="Email"
            onChange={handleInputs}
          />
        </div>
        <div className="input-field">
          <CiLock />
          <input
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleInputs}
          />
        </div>
        <div className="forgot-password-container">
          <button className="forgot-password-button">Forgot Password?</button>
        </div>
        <button
          className={`${isValid ? "login-button" : "invalid-login-button"}`}
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Log in
        </button>
        <p className="login-method-paragraph">
          Or Login using diffrent method :
        </p>
        <Providers providers={providers} />
        <div className="create-account">
          <span>Don't have an Account ?</span>
          <Link className="create-account-btn" href="/signup">
            Create an Account
          </Link>
        </div>
      </form>
    </article>
  );
}
