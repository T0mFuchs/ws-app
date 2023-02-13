import React from "react";
import { render } from "react-dom";
import { Provider } from "jotai";
import { App } from "./app";
import "./styles.css";
import "uno.css";

const Main = () => (
  <>
    <Provider>
      <App />
    </Provider>
  </>
);

render(<Main />, document.getElementById("app") as HTMLElement);
