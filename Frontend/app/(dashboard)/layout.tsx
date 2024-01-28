"use client";

import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar/Navbar";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logIn } from "@/redux/features/auth-slice";
import "@/styles/main.scss";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const user = useMemo(() => {
    const obj = {
      user_info: session?.user,
      status,
    };
    return obj;
  }, [session, status]);

  const redux = useAppSelector((state) => state.userReducer);

  async function checkUserLogin() {}

  console.log(session);

  useEffect(() => {
    if (user) {
      dispatch(logIn(user));
    }
  }, [user]);
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
