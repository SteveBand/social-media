"use client";

import { BackButton } from "@/components/action-buttons/BackButton";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { HiMagnifyingGlass } from "react-icons/hi2";

export function CommunitiesPageHeader() {
  return (
    <>
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
    </>
  );
}
