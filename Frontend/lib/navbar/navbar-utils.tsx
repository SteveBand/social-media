import { BsHouse, BsHeart, BsSearch } from "react-icons/bs";
import { RiImageAddLine } from "react-icons/ri";

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
    path: "/activity",
    name: "Activity",
    icon: <BsHeart className="navbar-link-icon" />,
  },
  {
    path: "/post/new",
    name: "Post",
    icon: <RiImageAddLine className="navbar-link-icon" />,
  },
  {
    path: "/",
  },
];
