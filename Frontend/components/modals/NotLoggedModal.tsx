import "@/styles/modals/notLoggedModal.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiLock, CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { PiGithubLogoFill } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { activate } from "@/redux/features/loginModal-slice";
import { useState } from "react";
import { logIn } from "@/redux/features/auth-slice";

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string;

export function NotLoggedModal() {
  const [loginParams, setLoginParams] = useState({});
  const router = useRouter();
  const dispatch = useAppDispatch();

  async function githubProvider() {
    router.push(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${"http://localhost:4000/auth/github/callback"}`
    );
  }

  async function googleProvider() {
    router.push("http://localhost:4000/auth/google/");
  }

  function handleFormParams(e: React.FormEvent<HTMLFormElement>) {
    const { id, value } = e.target as HTMLInputElement;
    setLoginParams((prev) => {
      return {
        ...prev,
        [id]: value,
      };
    });
  }

  const user = useAppSelector((state) => state.userReducer);

  async function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const res = await fetch(`http://localhost:4000/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginParams),
    });
    if (res.ok) {
      const data = await res.json();
      data &&
        dispatch(
          logIn({
            status: "authenticated",
            user_info: data,
          })
        );
      user && dispatch(activate());
    }
  }

  return (
    <section className="not-logged-modal-wrapper">
      <form className="not-logged-form" onChange={handleFormParams}>
        <div className="title">
          <h3>You have to Login for this action</h3>
          <IoMdClose className="icon" onClick={() => dispatch(activate())} />
        </div>
        <div className="input-field">
          <CiMail />
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            min={5}
          />
        </div>
        <div className="input-field">
          <CiLock />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            min={3}
          />
        </div>
        <div className="forgot-password-container">
          <button className="forgot-password-button">Forgot Password?</button>
        </div>
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
        <p>Or login using different method: </p>

        <div
          className={`provider-container github`}
          onClick={() => githubProvider()}
          key={"github"}
        >
          {<PiGithubLogoFill className="icon" />}
          {`Sign in with Github`}
        </div>

        <div
          className={`provider-container google`}
          onClick={() => googleProvider()}
          key={"google"}
        >
          {<FcGoogle className="icon" />}
          {`Sign in with Google`}
        </div>

        <div className="create-account">
          <span>Don't have an Account ?</span>
          <Link className="create-account-btn" href="/signup">
            Create an Account
          </Link>
        </div>
      </form>
    </section>
  );
}
