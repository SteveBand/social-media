import { PiGithubLogoFill } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Providers() {
  const router = useRouter();
  const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string;

  function githubProvider() {
    router.push(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${"http://localhost:4000/auth/github/callback"}`
    );
  }

  function googleProvider() {
    router.push("http://localhost:4000/auth/google/");
  }
  return (
    <div className="providers-wrapper">
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
    </div>
  );
}
