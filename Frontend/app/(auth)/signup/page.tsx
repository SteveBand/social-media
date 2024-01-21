"use client";

import { CiMail, CiLock, CiPhone } from "react-icons/ci";
import { BsPersonVcard } from "react-icons/bs";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { SignupParams } from "@/lib/auth-utilis/authTypes";
import { signupSchema } from "@/lib/auth-utilis/authSchemas";
import { useRouter } from "next/navigation";

export default function Page() {
  const [params, setParams] = useState<Partial<SignupParams>>({
    gender: "male",
  });
  const [isValid, setIsValid] = useState<boolean>(false);

  const router = useRouter();

  function handleInputs(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { id, value } = e.target;
    const obj = {
      ...params,
      [id]: value,
    };
    setParams(obj);
    const validation = signupSchema.validate(params);
    if (validation.error) {
      const error = validation.error.details.find((e) => e.context?.key === id);
      if (error) {
        setIsValid(false);
      }
    }
    if (validation.error === undefined) {
      setIsValid(true);
    }
  }

  async function signupFunc(params: Partial<SignupParams>) {
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    if (res.status === 200) {
      router.push("/login");
    }
  }
  return (
    <section className="signup-page-wrapper">
      <form className="signup-form">
        <div className="signup-input-container">
          <CiMail className="signup-input-icon" />
          <input
            type="text"
            id="email"
            className="signup-input"
            placeholder="Email"
            name="email"
            onChange={handleInputs}
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
            onChange={handleInputs}
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
            onChange={handleInputs}
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
            onChange={handleInputs}
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
            onChange={handleInputs}
          />
        </div>
        <div className="signup-select-container">
          <label className="signup-label">Select your gender</label>
          <select name="gender" id="gender" onChange={handleInputs}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="none">None of these</option>
          </select>
        </div>
        <button
          className={`${isValid ? "signup-button" : "signup-button-disabled"}`}
          disabled={!isValid}
          onClick={(e) => {
            e.preventDefault();
            signupFunc(params);
          }}
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
