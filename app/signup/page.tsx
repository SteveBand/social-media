import { CiMail, CiLock, CiPhone } from "react-icons/ci";
import { BsPersonVcard, BsGenderAmbiguous } from "react-icons/bs";
import Link from "next/link";
export default function Page() {
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
          />
        </div>
        <div className="signup-input-container">
          <CiLock className="signup-input-icon" />
          <input
            type="password"
            id="password"
            className="signup-input"
            placeholder="Password"
          />
        </div>
        <div className="signup-input-container">
          <BsPersonVcard className="signup-input-icon" />
          <input
            type="text"
            id="firstName"
            className="signup-input"
            placeholder="First name"
          />
        </div>
        <div className="signup-input-container">
          <BsPersonVcard className="signup-input-icon" />
          <input
            type="text"
            id="lastName"
            className="signup-input"
            placeholder="Last name"
          />
        </div>
        <div className="signup-input-container">
          <CiPhone className="signup-input-icon" />
          <input
            type="number"
            id="phoneNumber"
            className="signup-input"
            placeholder="Phone number"
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
        <button className="signup-button" type="submit">
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
