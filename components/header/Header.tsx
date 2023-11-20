import React from "react";
import Searchbar from "../searchbar/Searchbar";
import HeaderProfile from "./components/HeaderProfile";


type Props = {};

export default function Header({}: Props) {
  return (
    <header className="header-wrapper">
      <h1 className="header-title">Socilize</h1>
      <Searchbar />
      <HeaderProfile />
    </header>
  );
}
