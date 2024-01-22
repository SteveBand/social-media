import { NewCommunityCheckBox } from "@/app/(dashboard)/communities/new/components/NewCommunityCheckBox";
import { useState } from "react";
import { CommunityType } from "../../../../../../../types";

export function CommunityEditForm() {
  const [numOfLetters, setNumOfLetters] = useState({
    purpose: 0,
    title: 0,
  });
  const [logo, setLogo] = useState("");
  const [rules, setRules] = useState<{}[]>([]);
  const [formData, setFormData] = useState<Partial<CommunityType>>({ rules });

  function handleInputs(e: React.FormEvent<HTMLFormElement>) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function handleSubmit() {}

  const newRule = {};

  function addRule(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (rules.length < 5) {
      setRules((prev) => {
        return [...prev, {}];
      });
    }
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
          {rules.map((content, i) => {
            return (
              <input
                type="text"
                id={`${i}`}
                placeholder="Write the rule here"
              />
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
            defaultValue={""}
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
