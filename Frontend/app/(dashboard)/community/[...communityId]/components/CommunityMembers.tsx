import { User } from "@/components/User";
import { SlOptions } from "react-icons/sl";

export function CommunityMembers({
  members,
}: {
  members: any;
 
}) {
  return (
    <>
      {members.map((member: any) => {
        return <User content={member} loading={false} key={member.id} />;
      })}
    </>
  );
}
