import BackgroundFiller from "./components/BackgroundFiller";
import Form from "./components/form";
export default function Page() {
  return (
    <section className="login-page-wrapper">
      <section className="container">
        <article className="login-container">
          <Form />
        </article>
        <article className="background-filler">
          <div className="background-filler-content">
            <h1>Socilize</h1>
            <p>
              Welcome to the vibrant world of social media, where connections
              transcend borders. Share moments, express yourself, and stay
              connected with friends and trends. In this digital hub, every post
              is a story, and every like, a nod to shared experiences. Join the
              conversation, embrace the virtual tapestry of our global
              community, and let the journey begin!
            </p>
            <button className="signup-btn">Sign Up</button>
          </div>
          <BackgroundFiller />
        </article>
      </section>
    </section>
  );
}
