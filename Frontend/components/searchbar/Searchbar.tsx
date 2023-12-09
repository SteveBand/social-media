import React from "react";
import { CiSearch } from "react-icons/ci";

type Props = {};

export default function Searchbar({}: Props) {
  return (
    <div className="header-search">
      <CiSearch className="search-icon" />
      <input type="text" placeholder="Search" />
    </div>
  );
}
