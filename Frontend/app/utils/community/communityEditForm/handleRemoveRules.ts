import { CommunityType } from "../../../../../types";

export function handleRemoveRules(
  id: string,
  setFormData: React.Dispatch<React.SetStateAction<Partial<CommunityType>>>,
  formData: Partial<CommunityType>
) {
  const updatedRules = formData.rules.filter((rule: any) => {
    const ruleId = rule._id === undefined ? rule.ruleId : rule._id;
    return ruleId !== id;
  });
  setFormData((prev) => {
    return {
      ...prev,
      rules: updatedRules,
    };
  });
}
