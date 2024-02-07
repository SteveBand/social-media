import { BsHouse, BsSearch } from "react-icons/bs";

import { BsPeople } from "react-icons/bs";

export const navLinks = [
  {
    path: "/",
    name: "Home",
    icon: <BsHouse className="navbar-link-icon" />,
  },
  {
    path: "/search",
    name: "Search",
    icon: <BsSearch className="navbar-link-icon" />,
  },
  {
    path: "/communities",
    name: "Communities",
    icon: <BsPeople className="navbar-link-icon" />,
  },
];
