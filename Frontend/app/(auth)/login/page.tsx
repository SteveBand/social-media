import BackgroundFiller from "../../../components/ui/login/BackgroundFiller";
import Form from "../../../components/ui/login/form";

export default async function Page() {
  return (
    <section className="login-page-wrapper">
      <section className="container">
        <article className="login-container">
          <Form />
        </article>
        <article className="background-filler-container">
          <BackgroundFiller />
        </article>
      </section>
    </section>
  );
}
