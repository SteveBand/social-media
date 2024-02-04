import "@/styles/footer.scss";
import { GrGroup } from "react-icons/gr";
import { BsHouse, BsSearch } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { useAppSelector } from "@/hooks";
import { usePathname } from "next/navigation";

export function Footer() {
  const user = useAppSelector((state) => state.userReducer);
  const profileUrl =
    user.status === "authenticated"
      ? `/profile/${user?.user_info?._id}`
      : "/login";

  const pathName = usePathname();

  return (
    <footer className="root-footer">
      <Link href={"/"}>
        <BsHouse className={pathName === "/" ? "icon active" : "icon"} />
      </Link>
      <Link href={"/communities"}>
        <GrGroup
          className={
            pathName === "/communities" || pathName.includes("community")
              ? "icon active"
              : "icon"
          }
        />
      </Link>
      <Link href={"/search"}>
        <BsSearch className={pathName === "/search" ? "icon active" : "icon"} />
      </Link>
      <Link href={`/profile/${user?.user_info?.email}`}>
        <CgProfile
          className={
            pathName === `/profile/${user.user_info?._id}`
              ? "icon active"
              : "icon"
          }
        />
      </Link>
    </footer>
  );
}
