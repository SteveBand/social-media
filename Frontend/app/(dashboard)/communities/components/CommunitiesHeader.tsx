"use client";

import { BackButton } from "@/components/common/action-buttons/BackButton";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useAppSelector } from "@/hooks";
import Link from "next/link";

export function CommunitiesPageHeader() {
  const user = useAppSelector((state) => state.userReducer);

  return (
    <>
      <header>
        <div className="title">
          <BackButton />
          <h4>Communities</h4>
        </div>
        <div className="action-buttons">
          <Link
            href={"/communities/new"}
            onClick={(e) => {
              user.status === "unauthenticated" ? e.preventDefault() : null;
            }}
          >
            <AiOutlineUsergroupAdd className="icon" />
          </Link>
        </div>
      </header>
    </>
  );
}
