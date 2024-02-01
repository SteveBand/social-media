import { User } from "@/components/User";

export function CommunityMembers({ members }: { members: any }) {
  return (
    <>
      {members.map((member: any) => {
        return <User content={member} loading={false} key={member.id} />;
      })}
    </>
  );
}
