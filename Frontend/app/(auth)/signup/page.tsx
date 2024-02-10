"use client";

import { CiMail, CiLock, CiPhone } from "react-icons/ci";
import { BsPersonVcard } from "react-icons/bs";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserType } from "../../../../types";
import { handleSignup, handleSignupParams } from "@/app/utils/signup-page";

export default function Page() {
  const [params, setParams] = useState<Partial<UserType>>({
    gender: "male",
  });
  const [isValid, setIsValid] = useState<boolean>(false);

  const router = useRouter();

  return (
    <section className="signup-page-wrapper">
      <form
        className="signup-form"
        onChange={(e) => handleSignupParams(e, params, setParams, setIsValid)}
      >
        <div className="signup-input-container">
          <CiMail className="signup-input-icon" />
          <input
            type="text"
            id="email"
            className="signup-input"
            placeholder="Email"
            name="email"
          />
        </div>
        <div className="signup-input-container">
          <CiLock className="signup-input-icon" />
          <input
            type="password"
            id="password"
            className="signup-input"
            placeholder="Password"
            name="password"
          />
        </div>
        <div className="signup-input-container">
          <BsPersonVcard className="signup-input-icon" />
          <input
            type="text"
            id="firstName"
            className="signup-input"
            placeholder="First name"
            name="firstName"
          />
        </div>
        <div className="signup-input-container">
          <BsPersonVcard className="signup-input-icon" />
          <input
            type="text"
            id="lastName"
            className="signup-input"
            placeholder="Last name"
            name="lastName"
          />
        </div>
        <div className="signup-input-container">
          <CiPhone className="signup-input-icon" />
          <input
            type="number"
            id="phoneNumber"
            className="signup-input"
            placeholder="Phone number"
            name="phoneNumber"
          />
        </div>
        <div className="signup-select-container">
          <label className="signup-label">Select your gender</label>
          <select name="gender" id="gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="none">None of these</option>
          </select>
        </div>
        <button
          className={`${isValid ? "signup-button" : "signup-button-disabled"}`}
          disabled={!isValid}
          onClick={(e) => handleSignup(e, params, router)}
        >
          Sign up
        </button>
        <div className="back-to-login">
          <p>Already have an account ?</p>
          <Link href="/login">Log in</Link>
        </div>
      </form>
    </section>
  );
}
