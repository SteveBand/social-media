"use client";

import { Footer } from "@/components/layout/footer";
import Navbar from "@/components/layout/Navbar";
import { NotLoggedModal } from "@/components/modals/NotLoggedModal";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logIn } from "@/redux/features/auth-slice";
import "@/styles/main.scss";
import { useEffect } from "react";
import { EditModal } from "@/components/modals/EditModal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userReducer);
  const loginModal = useAppSelector((state) => state.loginReducer.isModal);
  // Function to check if user session still up or need to connect again
  // Checks by sending a request to the server and confirming an active session.
  // if session not found (means not active) then it returns false and an empty global user state is implemented with a status of 'unauthenticated'.
  async function sessionConnect() {
    try {
      const res = await fetch(`http://localhost:4000/login`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        // if server returns status of 200 it checks if the user data already exists inside the global redux state. if not it updates it with the user data.
        // to avoid Unnecessery Rendering we check if user already exists before updating it.
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
        // if server returns status other then 200 user global redux state is empty and unauthenticated
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

  useEffect(() => {
    if (user.status === "unauthenticated") {
      sessionConnect();
    }
    document.body.setAttribute("data-theme", "dark");
  }, [user.status]);

  return (
    <html lang="en">
      <body>
        {loginModal && <NotLoggedModal />}
        {<Navbar />}
        {children}
        {<Footer />}
      </body>
    </html>
  );
}
