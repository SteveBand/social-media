"use client";

import Link from "next/link";
import { CiLogout } from "react-icons/ci";
import { navLinks } from "@/lib/navbar/navbar-utils";
import { usePathname } from "next/navigation";
type Props = {};

export default function Navbar({}: Props) {
  const pathname = usePathname();

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
      </div>
      {/* <div className="navbar-logout-button">
        <div className="navbar-logout-button-container">
          <CiLogout className="navbar-logout-icon" />
          Logout
        </div>
      </div> */}
    </nav>
  );
}
