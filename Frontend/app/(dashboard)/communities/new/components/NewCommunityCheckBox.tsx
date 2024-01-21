import "@/styles/communities/new-community/newCommunity-radio.scss";

export function NewCommunityCheckBox() {
  return (
    <article className="membership">
      <h3>Membership</h3>
      <div className="cards-container">
        <input type="radio" id="open" value="open" name="membership" hidden />
        <label className="box" htmlFor="open">
          <h4>Open</h4>
          <p>
            A restricted group where only approved members can access and
            engage, fostering exclusive conversations and confidentiality.
          </p>
        </label>
        <input
          type="radio"
          id="private"
          value="private"
          name="membership"
          hidden
        />
        <label className="box" htmlFor="private">
          <h4>Private</h4>
          <p>
            A public group open to all, encouraging inclusivity and unrestricted
            interactions, ideal for diverse discussions and broad engagement.
          </p>
        </label>
      </div>
    </article>
  );
}
