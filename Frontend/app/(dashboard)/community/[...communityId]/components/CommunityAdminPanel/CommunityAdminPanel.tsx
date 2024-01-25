import { SetStateAction, useState } from "react";
import { CommunityType } from "../../../../../../../types";
import { CommunityMember } from "../CommnityContent";
import "@/styles/community/communityAdminPanel.scss";
import { NewCommunityCheckBox } from "@/app/(dashboard)/communities/new/components/NewCommunityCheckBox";
import { CommunityEditForm } from "./CommunityEditForm";

export function CommunityAdminPanel({ data, members, setData }: Props) {
  const [section, setSection] = useState("edit");

  function handleSection(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const target = e.target as HTMLLIElement;
    const attribute = target.getAttribute("data-section");
    attribute && setSection(attribute);
  }

  return (
    <section className="community-admin-panel">
      <ul>
        <li onClick={handleSection} data-section="members">
          Members
        </li>
        <li onClick={handleSection} data-section="edit">
          Edit
        </li>
        <li onClick={handleSection} data-section="moderators">
          Moderators
        </li>
      </ul>
      {section === "edit" && (
        <CommunityEditForm data={data} setData={setData} />
      )}
    </section>
  );
}

type Props = {
  data: CommunityType;
  setData: React.Dispatch<SetStateAction<CommunityType | undefined>>;
  members: CommunityMember[];
};
