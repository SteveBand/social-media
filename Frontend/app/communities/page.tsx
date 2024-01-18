"use client";

import { useState } from "react";
import { CommunitiesPageHeader } from "./components/CommunitiesHeader";

export default function CommunitiesPage() {
  const [list, setList] = useState();
  return (
    <section className="communities-page-container">
      <CommunitiesPageHeader />
      <section className="communities-list"></section>
    </section>
  );
}
