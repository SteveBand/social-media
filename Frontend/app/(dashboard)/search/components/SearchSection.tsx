"use client";

import { BackButton } from "@/components/action-buttons/BackButton";
import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { SlOptions } from "react-icons/sl";

export function SearchSection() {
  const [inputParams, setInputParams] = useState("");
  const [action, setAction] = useState("posts");
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInputParams(e.target.value);
  }

  async function handleFetch() {
    const res = await fetch(
      `http://localhost:4000/search?query=${inputParams}&action=${action}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  }

  return (
    <section className="search-container">
      <header>
        <BackButton />
        <div className="input-container">
          <HiMagnifyingGlass className="icon" />
          <input
            type="text"
            placeholder="Search..."
            defaultValue={inputParams}
            onChange={handleInput}
          />
        </div>
        <SlOptions />
      </header>
      <ul className="actions">
        <li data-fetch="posts">Posts</li>
        <li data-fetch="comments">Comments</li>
        <li data-fetch="communities">Communities</li>
        <li data-fetch="people">People</li>
      </ul>
    </section>
  );
}
