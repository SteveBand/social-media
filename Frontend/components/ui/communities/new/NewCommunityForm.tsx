"use client";

import { useState } from "react";
import { NewCommunityCheckBox } from "./NewCommunityCheckBox";
import { CommunityType } from "../../../../../types";
import { useRouter } from "next/navigation";
import { handleForm, handleSubmit } from "@/app/utils/communities/new";

export function NewCommunityForm() {
  const [numOfLetters, setNumOfLetters] = useState({
    title: 0,
    purpose: 0,
  });
  const [logo, setLogo] = useState("");
  const [formData, setFormData] = useState<Partial<CommunityType>>({
    membership: "open",
  });
  const router = useRouter();

  return (
    <form onChange={(e) => handleForm(e, setFormData)}>
      <article className="title article-container">
        <div className="container">
          <div className="upper">
            <p className="title">Community name</p>
            <p>{numOfLetters.title} / 30</p>
          </div>
          <input
            name="title"
            id="title"
            placeholder="Community Name"
            minLength={3}
            maxLength={30}
            onChange={(e) =>
              setNumOfLetters((prev) => ({
                ...prev,
                title: e.target.value.length,
              }))
            }
          />
        </div>
        <p>
          Name must be between 3 to 30 characters and can't include hashtags
        </p>
      </article>
      <article className="about article-container">
        <div className="container">
          <div className="upper">
            <p className="title">Community Purpose</p>
            <p>{numOfLetters.purpose} / 150</p>
          </div>
          <textarea
            name="about"
            id="about"
            minLength={3}
            maxLength={150}
            placeholder="Community Purpose"
            onChange={(e) =>
              setNumOfLetters((prev) => ({
                ...prev,
                purpose: e.target.value.length,
              }))
            }
          />
        </div>
        <p>
          Write the community purpose make it Cool, Short and avoid bad language
          or bad purposes
        </p>
      </article>
      <article className="logo-container">
        <input
          type="text"
          name="image"
          id="image"
          placeholder="Image Url "
          defaultValue={""}
          onChange={(e) => setLogo(e.target.value)}
        />
        <label htmlFor="image">Choose the logo of your Community</label>
        <img src={logo} />
      </article>
      <NewCommunityCheckBox />
      <button
        className="create-button"
        onClick={(e) => handleSubmit(e, formData, router)}
      >
        Create
      </button>
    </form>
  );
}
