import React from "react";
// @ts-ignore || package react-meta-tags has no types
import Head from "react-meta-tags";
import { render } from "react-dom";
import { Provider } from "jotai";
import { App } from "./app";
import "./styles.css";
import "uno.css";

const { VITE_API_URL, VITE_WS_URL, VITE_CLIENT_URL } = import.meta.env as {
  [key: string]: string;
};

const Main = () => (
  <>
    <Provider>
      <Head>
        <meta
          http-equiv="Content-Security-Policy"
          content={`
            default-src ${VITE_CLIENT_URL} ${VITE_API_URL};
            connect-src ${VITE_API_URL} ${VITE_WS_URL};
            img-src 'self' data:;
          `}
        />
      </Head>
      <App />
    </Provider>
  </>
);

render(<Main />, document.getElementById("app") as HTMLElement);
