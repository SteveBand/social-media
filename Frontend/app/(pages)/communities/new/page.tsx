"use client";
import { BackButton } from "@/components/action-buttons/BackButton";
import { NewCommunityForm } from "../../../../components/ui/communities/new/NewCommunityForm";
export default function NewCommunity() {
  return (
    <section className="new-community-page-container">
      <header>
        <BackButton />
        <h4>Create a new Community</h4>
      </header>
      <NewCommunityForm />
    </section>
  );
}
