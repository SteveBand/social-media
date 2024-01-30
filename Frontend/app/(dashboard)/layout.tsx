"use client";

import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar/Navbar";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logIn, logOut } from "@/redux/features/auth-slice";
import "@/styles/main.scss";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userReducer);
  async function sessionConnect() {
    try {
      const res = await fetch(`http://localhost:4000/login`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (user.status === "unauthenticated") {
          return dispatch(
            logIn({
              status: "authenticated",
              user_info: data,
            })
          );
        }
      } else {
        logIn({
          status: "unauthenticated",
          user_info: {},
        });
      }
    } catch (error) {
      console.log(error);
      logIn({
        status: "unauthenticated",
        user_info: {},
      });
    }
  }

  const redux = useAppSelector((state) => state.userReducer);

  useEffect(() => {
    sessionConnect();
  }, []);

  console.log(redux);
  return (
    <html lang="en">
      <body>
        {<Navbar />}
        {children}
        {<Footer />}
      </body>
    </html>
  );
}
