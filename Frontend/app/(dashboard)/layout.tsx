"use client";

import Navbar from "@/components/navbar/Navbar";
import { useAppDispatch } from "@/hooks";
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

  useEffect(() => {
    if (user) {
      dispatch(logIn(user));
    }
  }, [user]);

  console.log("hi");
  return (
    <html lang="en">
      <body>
        {<Navbar />}
        {children}
      </body>
    </html>
  );
}
