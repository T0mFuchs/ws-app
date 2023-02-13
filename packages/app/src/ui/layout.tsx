import React from "react";

import Page from "./page";
import NewPage from "./page/new";

import type { Page as PageType } from "@packages/types";

//import Modal from "./modal";
const Modal = React.lazy(() => import("./modal"));

export function Layout({ data }: { data: PageType[] | null }) {
  return (
    <div className="grid gap-2 p-4">
      <>
        {data ? (
          <>
            {data.map((item: PageType) => (
              <Page page={item} />
            ))}
            <NewPage />
            <>
              <React.Suspense fallback={<></>}>
                <Modal />
              </React.Suspense>
            </>
          </>
        ) : null}
      </>
    </div>
  );
}
