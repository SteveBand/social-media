import { useEffect, useState } from "react";
import { CommunityType, User } from "../../../../../types";
import moment from "moment";
export function CommunityAbout({ data }: { data: CommunityType }) {
  // const [moderators, setModerators] = useState<User[]>([]);
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
        {}
      </article>
    </section>
  );
}
