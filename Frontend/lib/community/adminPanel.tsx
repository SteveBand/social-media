import { SetStateAction } from "react";
import { CommunityType } from "../../../types";
import { v4 as uuidv } from "uuid";
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

export async function handleSubmit(
  e: React.MouseEvent<HTMLButtonElement>,
  formData: Partial<CommunityType>,
  id: string,
  setData: React.Dispatch<SetStateAction<CommunityType | undefined>>
) {
  e.preventDefault();
  try {
    const res = await fetch(`http://localhost:4000/community/${id}/edit`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const data = await res.json();
      setData(data);
    }
  } catch (error) {
    console.log(error);
  }
}

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
