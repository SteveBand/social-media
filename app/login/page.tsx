import BackgroundFiller from "./components/BackgroundFiller";
import Form from "./components/form";
export default function Page() {
  let backgroundfillerSide = true;
  return (
    <section className="login-page-wrapper">
      <section className="container">
        <article className="login-container">
          <Form />
        </article>
        <article className="background-filler-container">
          <BackgroundFiller side={backgroundfillerSide} />
        </article>
      </section>
    </section>
  );
}
