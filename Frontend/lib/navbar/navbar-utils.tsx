import { BsHouse, BsHeart, BsSearch } from "react-icons/bs";
import { RiAdminLine } from "react-icons/ri";
import { GrGroup } from "react-icons/gr";

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
    icon: <GrGroup className="navbar-link-icon" />,
  },
];
