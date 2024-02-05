"use client";
import { BackButton } from "@/components/common/action-buttons/BackButton";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { SlOptions } from "react-icons/sl";
import { useEffect, useState } from "react";
import { UsersResults } from "@/components/search/UsersResults";
import { CommunitiesResults } from "@/components/search/CommunitiesResults";
import { PostsResults } from "@/components/search/PostsResults";

export default function Page() {
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("posts");
  const [searchedData, setSearchedData] = useState([]);

  function handleAction(e: React.MouseEvent<HTMLLIElement>) {
    const target = e.target as HTMLLIElement;
    const attr = target.getAttribute("data-fetch");
    attr && setAction(attr);
  }

  async function handleSearchRequest() {
    try {
      const res = await fetch(
        `http://localhost:4000/search/${action}?q=${query}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setSearchedData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (query.length > 0) {
      handleSearchRequest();
    }
    console.log(query);
  }, [query, action]);

  return (
    <section className="search-container">
      <header>
        <BackButton />
        <div className="input-container">
          <HiMagnifyingGlass className="icon" />
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <SlOptions />
      </header>
      <ul className="actions">
        <li data-fetch="posts" onClick={handleAction}>
          Posts
        </li>
        <li data-fetch="comments" onClick={handleAction}>
          Comments
        </li>
        <li data-fetch="communities" onClick={handleAction}>
          Communities
        </li>
        <li data-fetch="users" onClick={handleAction}>
          People
        </li>
      </ul>
      {action === "users" && <UsersResults searchResults={searchedData} />}
      {action === "communities" && (
        <CommunitiesResults searchResults={searchedData} />
      )}
      {action === "posts" && <PostsResults searchResults={searchedData} />}
    </section>
  );
}
