import React from "react";
import { Provider } from "jotai";
import type { AppProps } from "next/app";
import "uno.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider>
        <Component {...pageProps} />
        <style global jsx>{`
          /* https://github.com/vercel/styled-jsx */
          :root {
            --text: #0e0c0c;
            --bg: #f0f0efee;
            --tag: #b3b3b3;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --text: #faf9efe5;
              --bg: #131313;
              --tag: #333333;
            }
          }
          * {
            box-sizing: border-box;
            margin: 0;
          }
          body {
            color: var(--text);
            background: var(--bg);
          }
          html {
            overflow-x: hidden;
          }
          @media (prefers-color-scheme: dark) {
            html {
              color-scheme: dark;
            }
          }
        `}</style>
      </Provider>
    </>
  );
}
