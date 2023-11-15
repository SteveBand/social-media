"use client";

import { CiLock, CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useState, useEffect } from "react";
import { LoginParams } from "@/lib/auth-utilis/authTypes";
import { loginSchema } from "@/lib/auth-utilis/authSchemas";
import { ValidationErrorItem } from "joi";

export default function LoginForm() {
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
    const errorsObj: any = {};

    if (validation.error) {
      const error = validation.error.details.find((e) => e.context?.key === id);

      if (error) {
        errorsObj[id] = error.message;
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }
  };

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
          <input type="password" id="password" placeholder="Password" />
        </div>
        <div className="forgot-password-container">
          <button className="forgot-password-button">Forgot Password?</button>
        </div>
        <button
          className={`${isValid ? "login-button" : "invalid-login-button"}`}
          disabled={!isValid}
        >
          Log in
        </button>
        <p className="login-method-paragraph">
          Or Login using diffrent method :
        </p>
        <div className="login-methods-container google">
          <div className="login-method">
            <FcGoogle />
            Google
          </div>
          <div className="login-method">
            <FaFacebook className="facebook-icon" />
            <span>Facebook</span>
          </div>
        </div>
        <div className="create-account">
          <span>Don't have an Account ?</span>
          <button className="create-account-btn">Create an Account</button>
        </div>
      </form>
    </article>
  );
}
