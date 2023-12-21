import moment from "moment";
import { useMemo } from "react";

export function Date({ date }: { date: string | undefined }) {
  const formattedDate = useMemo(() => {
    const parsedDate = date && moment(date, "MMM Do YY");
    if (!parsedDate) return "Invalid Date";
    const isoDate = parsedDate.toISOString();
    const format = moment(isoDate).format("MMM Do YY");
    return format;
  }, [date]);
  return <p className="date">{formattedDate}</p>;
}
