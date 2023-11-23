"use client";

import React, { useState } from "react";
import { PiUserCircle } from "react-icons/pi";
import { CiImageOn } from "react-icons/ci";

type Props = {};

export default function PostModal({}: Props) {
  const [height, setHeight] = useState(20);
  function handleTextArea(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const scrollHeight = e.target.scrollHeight;
    const defaultScrollHeight = 22;
    if (scrollHeight === 22) {
      return;
    }
    if (scrollHeight > defaultScrollHeight) {
      const newHeight = scrollHeight - defaultScrollHeight;
      setHeight(newHeight);
    }
  }
  return (
    <section className="feed-post-modal-wrapper">
      <form className="feed-post-modal-container">
        <article className="feed-post-modal-upper">
          <div className="feed-post-modal-profile-image">
            <PiUserCircle className="big-image" />
            <div className="line"></div>
            <PiUserCircle className="small-image" />
          </div>
          <div className="content">
            <div className="content-title">
              <h6>steve.bndkr</h6>
              <textarea
                id="description"
                placeholder="Start a post..."
                style={{ height: `${height}px` }}
                onChange={handleTextArea}
              />
            </div>
            <CiImageOn className="upload-image-icon" />
            <p className="add-to-post-button">Add to post</p>
          </div>
        </article>
      </form>
    </section>
  );
}
