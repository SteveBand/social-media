import { CiLock, CiMail } from "react-icons/ci";

export default function LoginForm() {
  return (
    <article className="login-content">
      <h1>Socilize</h1>
      <h2>Log in to your Account</h2>
      <form className="login-form">
        <div className="input-field">
          <span className="login-label">
            <CiMail />
            <label htmlFor="email">Email</label>
          </span>
          <input type="text" id="email" />
        </div>
        <div className="input-field">
          <span className="login-label">
            <CiLock />
            <label htmlFor="password">Password</label>
          </span>
          <input type="password" id="password" />
        </div>
      </form>
    </article>
  );
}
