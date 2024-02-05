import { User } from "@/components/common/User";

export function CommunityMembers({ members }: { members: any }) {
  return (
    <>
      {members.map((member: any) => {
        return <User content={member} loading={false} key={member.id} />;
      })}
    </>
  );
}
