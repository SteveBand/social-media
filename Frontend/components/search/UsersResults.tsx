import { User } from "@/components/ui/User";
import { UserType } from "../../../types";

export function UsersResults({ searchResults }: { searchResults: UserType[] }) {
  return (
    <>
      {searchResults.map((user) => {
        return <User content={user} key={user._id} />;
      })}
    </>
  );
}
