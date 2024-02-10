import { CommunityType } from "../../../../../types";
import { v4 as uuidv } from "uuid";

export function addRule(
  e: React.MouseEvent<HTMLButtonElement>,
  setFormData: React.Dispatch<React.SetStateAction<Partial<CommunityType>>>,
  formData: Partial<CommunityType>
) {
  e.preventDefault();
  if (formData.rules.length < 5) {
    const newRule = {
      description: "",
      ruleId: uuidv(),
    };
    setFormData((prev) => {
      const rules = [...prev.rules, newRule];
      return {
        ...prev,
        rules,
      };
    });
  }
}
