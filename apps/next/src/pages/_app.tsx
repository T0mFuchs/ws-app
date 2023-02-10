import React from "react";
import type { AppProps } from "next/app";
import "./styles.css";
import "uno.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
