"use client";

import React, { useState } from "react";
import { PiUserCircle } from "react-icons/pi";
type Props = {};

export default function HeaderProfile({}: Props) {
  const [dropdown, setDropdown] = useState(true);

  function handleDropdown() {
    setDropdown((prev) => !prev);
  }

  return (
    <div className="header-profile-container">
      <PiUserCircle
        className="header-profile-icon"
        onClick={() => handleDropdown()}
      />
      <ul
        className={`${
          dropdown
            ? "header-profile-dropdown"
            : "header-profile-dropdown-disabled"
        }`}
      >
        <li>Profile</li>
        <li>Account Settings</li>
        <li>Logout</li>
      </ul>
    </div>
  );
}
