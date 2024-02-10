import { NewCommunityCheckBox } from "@/components/ui/communities/new/NewCommunityCheckBox";
import { IoIosClose } from "react-icons/io";
import { SetStateAction, useState } from "react";
import { CommunityType } from "../../../../../../../types";
import {
  addRule,
  handleInputs,
  handleRemoveRules,
  handleSubmit,
} from "@/lib/community/adminPanel";
export function CommunityEditForm({ data, setData }: Props) {
  const [numOfLetters, setNumOfLetters] = useState({
    purpose: 0,
    title: 0,
  });
  const [logo, setLogo] = useState(data.image || "");
  const [formData, setFormData] = useState<Partial<CommunityType>>({
    rules: data.rules,
  });
  return (
    <form onChange={(e) => handleInputs(e, setFormData)}>
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
              defaultValue={data.title}
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
              defaultValue={data.about}
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
              <div
                className="rule-wrapper"
                key={`${content._id || content.ruleId}`}
              >
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
                  onClick={() =>
                    handleRemoveRules(
                      content._id || content.ruleId,
                      setFormData,
                      formData
                    )
                  }
                />
              </div>
            );
          })}
          <button onClick={(e) => addRule(e, setFormData, formData)}>
            Add a rule
          </button>
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
        <button
          className="create-button"
          onClick={(e) => handleSubmit(e, formData, data._id, setData)}
        >
          Edit
        </button>
      </article>
    </form>
  );
}

type Props = {
  data: CommunityType;
  setData: React.Dispatch<SetStateAction<CommunityType | undefined>>;
};
