import { NewCommunityCheckBox } from "@/app/(dashboard)/communities/new/components/NewCommunityCheckBox";
import { IoIosClose } from "react-icons/io";
import { useState } from "react";
import { CommunityType } from "../../../../../../../types";
import { v4 as uuidv } from "uuid";
export function CommunityEditForm({ data }: { data: CommunityType }) {
  const [numOfLetters, setNumOfLetters] = useState({
    purpose: 0,
    title: 0,
  });
  const [logo, setLogo] = useState(data.image || "");
  const [formData, setFormData] = useState<Partial<CommunityType>>({
    rules: data.rules,
  });

  function handleInputs(e: React.FormEvent<HTMLFormElement>) {
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

    console.log(formData);
  }

  async function handleSubmit() {}

  function addRule(e: React.MouseEvent<HTMLButtonElement>) {
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
    console.log(formData);
  }

  function handleRemoveRules(id: any) {
    const updatedRules = formData.rules.filter(
      (rule: any) => rule.ruleId !== id
    );
    setFormData((prev) => {
      return {
        ...prev,
        rules: updatedRules,
      };
    });
    console.log(formData.rules);
  }

  return (
    <form onChange={handleInputs}>
      <article className="admin-panel-container">
        <h3>Edit Community Page</h3>
        <article className="title article-container">
          <div className="container">
            <div className="upper">
              <p className="title">Community name</p>
              <p>{numOfLetters.title} / 30</p>
            </div>
            <input
              name="title"
              id="title"
              placeholder="Community Name"
              minLength={3}
              maxLength={30}
              onChange={(e) =>
                setNumOfLetters((prev) => ({
                  ...prev,
                  title: e.target.value.length,
                }))
              }
            />
          </div>
          <p>
            Name must be between 3 to 30 characters and can't include hashtags
          </p>
        </article>
        <article className="about article-container">
          <div className="container">
            <div className="upper">
              <p className="title">Community Purpose</p>
              <p>{numOfLetters.purpose} / 150</p>
            </div>
            <textarea
              name="about"
              id="about"
              minLength={3}
              maxLength={150}
              placeholder="Community Purpose"
              onChange={(e) =>
                setNumOfLetters((prev) => ({
                  ...prev,
                  purpose: e.target.value.length,
                }))
              }
            />
          </div>
          <p>
            Write the community purpose make it Cool, Short and avoid bad
            language or bad purposes
          </p>
        </article>
        <article className="rules-container">
          <h3>Rules</h3>
          {formData.rules.map((content: any, i: number) => {
            return (
              <div className="rule-wrapper" key={`${content.ruleId}`}>
                <label>{i + 1}</label>
                <input
                  type="text"
                  name="rule"
                  placeholder="Write the rule here"
                  id={`${i}`}
                  defaultValue={content.description}
                />
                <IoIosClose
                  className="close-icon"
                  onClick={() => handleRemoveRules(content.ruleId)}
                />
              </div>
            );
          })}
          <button onClick={addRule}>Add a rule</button>
        </article>
        <article className="logo-container">
          <input
            type="text"
            name="image"
            id="image"
            placeholder="Image Url "
            defaultValue={data.image}
            onChange={(e) => setLogo(e.target.value)}
          />
          <label htmlFor="image">Choose the logo of your Community</label>
          <img src={logo} />
        </article>
        <NewCommunityCheckBox />
        <button className="create-button">Edit</button>
      </article>
    </form>
  );
}
