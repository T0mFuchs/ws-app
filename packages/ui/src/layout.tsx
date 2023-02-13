import React from "react";

import Page from "./page";
import NewPage from "./page/new";

import type { Page as PageType } from "@packages/types";

export function Layout({ data }: { data: PageType[] | null }) {
  return (
    <div grid gap-2 p-4>
      <>
        {data ? (
          <>
            {data.map((item: PageType) => (
              <Page item={item} />
            ))}
            <NewPage />
          </>
        ) : null}
      </>

      <></>
    </div>
  );
}
