import Navbar from "@/components/navbar/Navbar";
import { SearchSection } from "./components/SearchSection";
import { FilterSection } from "./components/FilterSection";

export default function Page() {
  return (
    <section className="search-page-wrapper">
      <SearchSection />
      {/* <FilterSection /> */}
    </section>
  );
}
