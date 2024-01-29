import "@/styles/components/notLoggedModal.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiLock, CiMail } from "react-icons/ci";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { PiGithubLogoFill } from "react-icons/pi";

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string;

export function NotLoggedModal() {
  const router = useRouter();
  const providers = [
    {
      className: "github",
      name: "GitHub",
      icon: <PiGithubLogoFill className="icon" />,
      login: `/auth/github/callback`,
    },
    {
      className: "google",
      name: "Google",
      icon: <FcGoogle className="icon" />,
      login: "",
    },
    {
      className: "facebook",
      name: "Facebook",
      icon: <FaFacebook className="icon" />,
      login: "",
    },
  ];

  async function handleProviderLogin(path: string) {
    router.push(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${"http://localhost:4000/auth/github/callback"}`
    );
  }

  return (
    <section className="not-logged-modal-wrapper">
      <form className="not-logged-form">
        <h3>You have to Login for this action</h3>
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
        {providers.map((provider) => {
          return (
            <div
              className={`provider-container ${provider.className}`}
              onClick={() => handleProviderLogin(provider.login)}
              key={provider.className}
            >
              {provider.icon}
              {`Sign in with ${provider.name}`}
            </div>
          );
        })}
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
