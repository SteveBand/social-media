"use client";

import { AppProps } from "next/app";
import { useEffect } from "react";

interface MyAppProps extends AppProps {
  component: any;
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: MyAppProps) {
    useEffect(() => {
      
  }, []);
  return <Component {...pageProps} />;
}
