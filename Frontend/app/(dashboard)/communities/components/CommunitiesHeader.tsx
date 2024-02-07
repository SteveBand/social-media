"use client";

import { BackButton } from "@/components/common/action-buttons/BackButton";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "@/hooks";
import Link from "next/link";
import { activate } from "@/redux/features/loginModal-slice";

export function CommunitiesPageHeader() {
  const user = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();

  function handleNavigate(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (user.status === "unauthenticated") {
      e.preventDefault();
      dispatch(activate());
    }
  }

  return (
    <>
      <header>
        <div className="title">
          <BackButton />
          <h4>Communities</h4>
        </div>
        <div className="action-buttons">
          <Link href={"/communities/new"} onClick={handleNavigate}>
            <AiOutlineUsergroupAdd className="icon" />
          </Link>
        </div>
      </header>
    </>
  );
}
