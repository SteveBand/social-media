"use client";

import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { navLinks } from "@/lib/navbar/navbar-utils";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useAppSelector } from "@/hooks";
type Props = {};

export default function Navbar({}: Props) {
  const pathname = usePathname();
  const [modal, setModal] = useState(false);
  const user = useAppSelector((state) => state.userReducer);

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-links-wrapper">
        {navLinks.map((el) => {
          return (
            <Link
              key={el.path}
              href={el.path}
              className={`${
                pathname === el.path ? "navbar-link-active" : "navbar-link"
              }`}
            >
              {el.icon}
              <div className="navbar-link-name">{el.name}</div>
            </Link>
          );
        })}
        <div
          className={`${
            pathname === `/profile/${user?.user_info?.email}`
              ? "logged-user active"
              : "logged-user"
          }`}
          onClick={() => setModal((prev) => !prev)}
        >
          {user?.user_info?.avatar_url ? (
            <img src={user.user_info.avatar_url} />
          ) : (
            <CgProfile />
          )}
          <p>{user?.user_info?.name}</p>
          {modal && (
            <div className="logged-user-modal">
              <Link href={`/profile/${user.user_info.email}`}>Profile</Link>
              <div className="signout" onClick={() => signOut()}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
