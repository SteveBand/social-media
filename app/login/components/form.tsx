import { CiLock, CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function LoginForm() {
  return (
    <article className="login-content">
      <h1>Socilize</h1>
      <h2>Log in to your Account</h2>
      <form className="login-form">
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
        <button className="login-button">Log in</button>
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
