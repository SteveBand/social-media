"use client";
import { BackButton } from "@/components/action-buttons/BackButton";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

export default function CommunitiesPage() {
  return (
    <section className="communities-page-container">
      <header>
        <div className="title">
          <BackButton />
          <h4>Communities</h4>
        </div>
        <div className="action-buttons">
          <button>
            <HiMagnifyingGlass className="icon" />
          </button>
          <button>
            <AiOutlineUsergroupAdd className="icon" />
          </button>
        </div>
      </header>
    </section>
  );
}
