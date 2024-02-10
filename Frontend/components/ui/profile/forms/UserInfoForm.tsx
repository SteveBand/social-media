import { SetStateAction, useState } from "react";
import { UserType } from "../../../../../types";
import { editUserSchema } from "@/app/utils/validations/editUserSchema";

export function UserInfoForm({
  user,
  setUser,
}: {
  user: Partial<UserType>;
  setUser: React.Dispatch<SetStateAction<Partial<UserType> | undefined>>;
}) {
  const [imageSrc, setImageSrc] = useState(user.avatar_url || "");
  const [formParams, setFormParams] = useState<Partial<UserType>>();
  const [isValid, setIsValid] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleParams(e: React.FormEvent<HTMLFormElement>) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { id, value } = target;
    const obj = {
      ...formParams,
      [id]: value,
    };
    const validateObj = editUserSchema.validate(obj);
    setFormParams(obj);
    if (validateObj.error) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/user/edit/info?userId=${user._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formParams),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form className="change-info" onChange={handleParams}>
      <div className="input-container">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" defaultValue={user.name} />
      </div>
      <div className="input-container">
        <label htmlFor="email">Email</label>
        <input type="text" id="email" defaultValue={user.email} />
      </div>
      <div className="input-container">
        <label htmlFor="bio">Bio</label>
        <textarea id="bio" defaultValue={user.bio} />
      </div>
      <div className="input-container">
        <label htmlFor="phoneNumber">Phone number</label>
        <input type="text" id="phoneNumber" defaultValue={user.phoneNumber} />
      </div>
      <div className="input-container">
        <label htmlFor="gender">Gender</label>
        <select name="gender" id="gender" defaultValue={user.gender}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="input-container">
        <label htmlFor="avatar_url">Profile Image</label>
        <input
          type="text"
          id="avatar_url"
          defaultValue={user.avatar_url}
          onChange={(e) => setImageSrc(e.target.value)}
        />
      </div>
      <img src={imageSrc} width={150} className="profile-image" />
      <button
        className="action-button submit-button"
        disabled={!isValid}
        onClick={handleSubmit}
      >
        Edit
      </button>
      <p className="success">{success && "User successfuly edited!"}</p>
    </form>
  );
}
