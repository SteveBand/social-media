import "@/styles/components/notLoggedModal.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiLock, CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { PiGithubLogoFill } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch } from "@/hooks";
import { activate } from "@/redux/features/loginModal-slice";

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string;

export function NotLoggedModal() {
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

  return (
    <section className="not-logged-modal-wrapper">
      <form className="not-logged-form">
        <div className="title">
          <h3>You have to Login for this action</h3>
          <IoMdClose className="icon" onClick={() => dispatch(activate())} />
        </div>
        <div className="input-field">
          <CiMail />
          <input type="text" id="email" name="email" placeholder="Email" />
        </div>
        <div className="input-field">
          <CiLock />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
          />
        </div>
        <div className="forgot-password-container">
          <button className="forgot-password-button">Forgot Password?</button>
        </div>
        <button className="login-button">Login</button>
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
