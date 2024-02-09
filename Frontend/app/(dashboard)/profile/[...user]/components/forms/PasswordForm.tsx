import { passwordSchema } from "@/lib/auth-utilis/authSchemas";
import { useEffect, useState } from "react";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({
    currentPass: "",
    newPass: "",
    RepeatPass: "",
  });
  const [success, setSucess] = useState(false);

  const errorsObj = {
    currentPass: "",
    newPass: "",
    RepeatPass: "",
  };

  useEffect(() => {
    new Promise((resolve, reject) => {
      const JoiValidation = passwordSchema.validate(newPassword);

      if (JoiValidation.error) {
        setIsValid(false);
        setErrors((prev) => ({
          ...prev,
          newPass: JoiValidation.error.details[0].message,
        }));
        reject(JoiValidation.error.details[0].message);
        return;
      } else {
        setErrors((prev) => ({
          ...prev,
          newPass: "",
        }));
      }

      if (repeatPassword !== newPassword) {
        setIsValid(false);
        setErrors((prev) => ({
          ...prev,
          RepeatPass: "Passwords do not match!",
        }));
        reject("Password Does not match");
        return;
      } else {
        setErrors((prev) => ({
          ...prev,
          RepeatPass: "",
        }));
      }

      if (!currentPassword) {
        setIsValid(false);
        reject("All verifications Passed");
        return;
      }

      resolve(setIsValid(true));
    }).catch((err) => setIsValid(false));
  }, [repeatPassword, newPassword, currentPassword]);

  async function changePassword(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const res = await fetch(`http://localhost:4000/user/edit/password`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword, oldPassword: currentPassword }),
    });
    if (res.ok) {
      setErrors((prev) => ({
        RepeatPass: "",
        newPass: "",
        currentPass: "",
      }));
      setSucess(true);
    }
    if (res.status === 400) {
      setErrors((prev) => ({
        currentPass: "",
        RepeatPass: "",
        newPass: "The new password must be different from the current password",
      }));
    }

    if (res.status === 403) {
      setErrors((prev) => ({
        RepeatPass: "",
        newPass: "",
        currentPass: "Password is Incorrect",
      }));
    }
  }

  return (
    <form>
      <div className="input-container">
        <label>Current Password</label>
        <input
          type="password"
          min={5}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <p>{errors.currentPass.length > 0 && errors.currentPass}</p>
      </div>
      <div className="input-container">
        <label>New Password</label>
        <input
          type="password"
          min={5}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <p>{errors.newPass.length > 0 && errors.newPass}</p>
      </div>
      <div className="input-container">
        <label>Repeat New Password</label>
        <input
          type="password"
          min={5}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        <p>{errors.RepeatPass.length > 0 && errors.RepeatPass}</p>
      </div>

      <button
        className="action-button"
        disabled={!isValid}
        onClick={changePassword}
      >
        Change Password
      </button>
      <p className="success">
        {success && "Password have been changed Successfuly"}
      </p>
    </form>
  );
}
