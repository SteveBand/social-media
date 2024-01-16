import { CommunityModerator, CommunityType } from "../../../../../types";
import { User } from "@/components/User";
export function CommunityAbout({
  data,
  moderators,
}: {
  data: CommunityType;
  moderators: CommunityModerator[];
}) {
  return (
    <section className="about">
      <article className="community-info">
        <h4>Community Info</h4>
        <p>{data.about}</p>
      </article>
      <article className="rules">
        <h4>Rules</h4>
        <p>These are set and enforced by Community admins </p>
        {data.rules.map((rule: { description: string }, i: number) => {
          return (
            <div className="rule-wrapper">
              <div className="order-number">{i + 1}</div>
              <h5>{rule.description}</h5>
            </div>
          );
        })}
      </article>
      <article className="moderators">
        <h4>Moderators</h4>
        {moderators.map((user) => {
          return <User content={user} loading={false} key={user.id} />;
        })}
      </article>
    </section>
  );
}
