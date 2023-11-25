"use client";

import React, { useState } from "react";
import { PiUserCircle } from "react-icons/pi";
import { CiImageOn } from "react-icons/ci";

type Props = {};

export default function PostModal({}: Props) {
  const [height, setHeight] = useState(34);

  return (
    <section className="feed-post-modal-wrapper">
      <form className="feed-post-modal-container">
        <div className="profile-content">
          <PiUserCircle className="icon" />
          <p>Steve.Bndkr</p>
        </div>
        <div className="inputs">
          <span
            className="textarea"
            role="textbox"
            contentEditable
            placeholder="Write here"
          ></span>
          <CiImageOn className="icon" />
        </div>
        <button className="feed-post-modal-button">Post</button>
      </form>
    </section>
  );
}
