"use client";

import Link from "next/link";
import { navLinks } from "@/lib/navbar/navbar-utils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logIn } from "@/redux/features/auth-slice";

export default function Navbar() {
  const pathname = usePathname();
  const [modal, setModal] = useState(false);
  const user = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleLogout() {
    const res = await fetch(`http://localhost:4000/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      dispatch(
        logIn({
          status: "unauthenticated",
          user_info: {},
        })
      );
      router.push("/");
    }
  }

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-links-wrapper">
        {navLinks.map((el) => {
          return (
            <Link
              key={el.path}
              href={el.path}
              className={`${
                pathname === el.path ||
                (el.name === "Communities" && pathname.includes("community"))
                  ? "navbar-link-active"
                  : "navbar-link"
              }`}
            >
              {el.icon}
              <div className="navbar-link-name">{el.name}</div>
            </Link>
          );
        })}
        <div
          className={`${
            pathname === `/profile/${user?.user_info?._id}`
              ? "logged-user active"
              : "logged-user"
          }`}
          onClick={() => setModal((prev) => !prev)}
        >
          {user?.user_info?.avatar_url ? (
            <div className="user-field-logged">
              <img src={user.user_info.avatar_url} />
              <p>{user?.user_info?.name}</p>
            </div>
          ) : (
            <button
              className="login-button"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          )}

          {modal && user.status === "authenticated" && (
            <div className="logged-user-modal">
              <Link href={`/profile/${user.user_info._id}`}>Profile</Link>
              <div className="signout" onClick={() => handleLogout()}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
