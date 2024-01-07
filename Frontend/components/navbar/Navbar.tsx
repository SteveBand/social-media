"use client";

import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { navLinks } from "@/lib/navbar/navbar-utils";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
type Props = {};

export default function Navbar({}: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [modal, setModal] = useState(false);
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
            pathname === `/profile/${session?.user?.email}`
              ? "logged-user active"
              : "logged-user"
          }`}
          onClick={() => setModal((prev) => !prev)}
        >
          {session?.user?.image ? (
            <img src={session.user.image} />
          ) : (
            <CgProfile />
          )}
          <p>{session?.user?.name}</p>
          {modal && (
            <div className="logged-user-modal">
              <Link href={`/profile/${session?.user?.email}`}>Profile</Link>
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
