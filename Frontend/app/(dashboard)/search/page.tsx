"use client";
import { BackButton } from "@/components/common/action-buttons/BackButton";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { SlOptions } from "react-icons/sl";
import { useEffect, useState } from "react";
import { UsersResults } from "@/components/search/UsersResults";
import { CommunitiesResults } from "@/components/search/CommunitiesResults";
import { PostsResults } from "@/components/search/PostsResults";
import { CommentsResults } from "@/components/search/CommentsResults";
import { useDebouncedCallback } from "use-debounce";

export default function Page() {
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("posts");
  const [searchedData, setSearchedData] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleAction(e: React.MouseEvent<HTMLLIElement>) {
    const target = e.target as HTMLLIElement;
    setSearchedData([]);
    const attr = target.getAttribute("data-fetch");
    attr && setAction(attr);
  }

  const handleSearchRequest = useDebouncedCallback(async () => {
    if (query.length > 2) {
      try {
        const res = await fetch(
          `http://localhost:4000/search/${action}?q=${query}`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setSearchedData(data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, 600);

  useEffect(() => {
    if (query.length > 2 && action) {
      handleSearchRequest();
    }
    if (query.length <= 0) {
      setSearchedData([]);
      setLoading(false);
    }

    if (query.length >= 1 && searchedData.length <= 0) {
      setLoading(true);
    }
    console.log(action, searchedData);
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
        <div></div>
      </header>
      <ul className="actions">
        <li
          data-fetch="posts"
          className={`${action === "posts" ? "active" : null}`}
          onClick={handleAction}
        >
          Posts
        </li>
        <li
          data-fetch="comments"
          className={`${action === "comments" ? "active" : null}`}
          onClick={handleAction}
        >
          Comments
        </li>
        <li
          data-fetch="communities"
          className={`${action === "communities" ? "active" : null}`}
          onClick={handleAction}
        >
          Communities
        </li>
        <li
          data-fetch="users"
          className={`${action === "users" ? "active" : null}`}
          onClick={handleAction}
        >
          People
        </li>
      </ul>
      {action === "users" && <UsersResults searchResults={searchedData} />}
      {action === "communities" && (
        <CommunitiesResults searchResults={searchedData} />
      )}
      {action === "posts" && <PostsResults searchResults={searchedData} />}
      {action === "comments" && (
        <CommentsResults searchResults={searchedData} />
      )}
      {loading && <div className="loader"></div>}
      {searchedData.length <= 0 && !loading && (
        <div className="no-results">No Results !</div>
      )}
    </section>
  );
}
