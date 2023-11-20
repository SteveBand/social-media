import React from "react";

type Props = {};

export default function Searchbar({}: Props) {
  return (
    <div className="header-search">
      <input type="text" placeholder="Search" />
    </div>
  );
}
