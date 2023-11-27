"use client";

import { store } from "@/redux/store";
import "@/styles/main.scss";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider store={store}>
        <body>{children}</body>
      </Provider>
    </html>
  );
}
