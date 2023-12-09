import { getProviders, getSession } from "next-auth/react";
import BackgroundFiller from "./components/BackgroundFiller";
import Form from "./components/form";

export default async function Page() {
  const providers = await getProviders();

  return (
    <section className="login-page-wrapper">
      <section className="container">
        <article className="login-container">
          <Form providers={providers} />
        </article>
        <article className="background-filler-container">
          <BackgroundFiller />
        </article>
      </section>
    </section>
  );
}
