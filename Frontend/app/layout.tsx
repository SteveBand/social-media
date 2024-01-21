import React from "react";
import "@/styles/main.scss";
import AuthProvider from "@/lib/AuthProvider";
import { ReduxProvider } from "@/redux/Provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
