import { CommunityType } from "../../../../../types";

export function handleInputs(
  e: React.FormEvent<HTMLFormElement>,
  setFormData: React.Dispatch<React.SetStateAction<Partial<CommunityType>>>
) {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement;
  const { name, value, id } = target;
  if (name === "rule") {
    return setFormData((prev) => {
      const updatedRules = prev.rules.map((rule: {}, index: number) => {
        if (index.toString() === id) {
          return { ...rule, description: value };
        }
        return rule;
      });
      return { ...prev, rules: updatedRules };
    });
  } else {
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  }
}
