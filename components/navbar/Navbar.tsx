"use client";

import Link from "next/link";
import { BsHouse, BsHeart, BsSearch } from "react-icons/bs";
import { RiImageAddLine } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";

import { usePathname } from "next/navigation";
type Props = {};

export default function Navbar({}: Props) {
  const pathname = usePathname();
  return (
    <nav className="navbar-wrapper">
      <div className="navbar-links-wrapper">
        <Link href="/">
          <BsHouse className="navbar-link-icon" />
          <div>Home</div>
        </Link>
        <Link href="/">
          <BsSearch className="navbar-link-icon" />

          <div> Search</div>
        </Link>
        <Link href="/">
          <BsHeart className="navbar-link-icon" />

          <div>Activity</div>
        </Link>
        <Link href="/">
          <RiImageAddLine className="navbar-link-icon" />
          <div>Post</div>
        </Link>
      </div>
      <div className="navbar-logout-button">
        <div className="navbar-logout-button-container">
          <CiLogout className="navbar-logout-icon" />
          Logout
        </div>
      </div>
    </nav>
  );
}
