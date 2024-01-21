"use client";
import { BackButton } from "@/components/action-buttons/BackButton";
import { useState } from "react";
export default function NewCommunity() {
  const [numOfLetters, setNumOfLetters] = useState({
    title: 0,
    purpose: 0,
  });
  return (
    <section className="new-community-page-container">
      <header>
        <BackButton />
        <h4>Create a new Community</h4>
      </header>
      <form>
        <article className="title">
          <div className="container">
            <div className="upper">
              <p className="title">Community name</p>
              <p>{numOfLetters.title} / 30</p>
            </div>
            <input
              name="title"
              id="title"
              placeholder="Community Name"
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
        <article className="about">
          <div className="container">
            <div className="upper">
              <p className="title">Community Purpose</p>
              <p>{numOfLetters.purpose} / 150</p>
            </div>
            <textarea
              name="purpose"
              id="purpose"
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
            Write the community purpose make it Cool, Short and avoid bad
            language or bad purposes
          </p>
        </article>
      </form>
    </section>
  );
}
