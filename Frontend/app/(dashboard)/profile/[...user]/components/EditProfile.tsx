import { UserType } from "../../../../../../types";
import { SetStateAction, useState } from "react";
import { UserInfoForm } from "./forms/UserInfoForm";
import { PasswordForm } from "./forms/PasswordForm";

export function EditProfile({
  user,
  setEdit,
  setUser,
}: {
  user: Partial<UserType>;
  setEdit: React.Dispatch<SetStateAction<boolean>>;
  setUser: React.Dispatch<SetStateAction<Partial<UserType> | undefined>>;
}) {
  const [section, setSection] = useState<FormSection>("userInfo");

  function handleSections(e: React.MouseEvent<HTMLLIElement>) {
    const target = e.target as HTMLLIElement;
    const attr = target.getAttribute("data-section") as FormSection;
    setSection(attr);
  }

  return (
    <section className="edit-profile-container">
      <header>
        <h4>{user.name}</h4>
        <button
          className="action-button"
          onClick={(e) => {
            e.preventDefault();
            setEdit(false);
          }}
        >
          To Profile
        </button>
      </header>
      <ul>
        <li
          data-section="userInfo"
          onClick={handleSections}
          className={`${section === "userInfo" && "active"}`}
        >
          Edit Info
        </li>
        <li
          data-section="password"
          onClick={handleSections}
          className={`${section === "password" && "active"}`}
        >
          Change Password
        </li>
      </ul>
      {section === "userInfo" && <UserInfoForm user={user} setUser={setUser} />}
      {section === "password" && <PasswordForm />}
    </section>
  );
}

type FormSection = "password" | "userInfo";
