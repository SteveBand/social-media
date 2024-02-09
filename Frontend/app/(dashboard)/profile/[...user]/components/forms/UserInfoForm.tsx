import { useState } from "react";
import { UserType } from "../../../../../../../types";

export function UserInfoForm({ user }: { user: Partial<UserType> }) {
  const [imageSrc, setImageSrc] = useState(user.avatar_url || "");
  return (
    <form className="change-info">
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
      <button className="action-button submit-button">Edit</button>
    </form>
  );
}
