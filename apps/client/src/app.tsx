import React from "react";
import { io } from "socket.io-client";
import { useAtom } from "jotai";
import { pagesAtom } from "@packages/app";

import { Layout } from "@packages/app";

import type { Socket } from "socket.io-client";
import type { PageContent, Page } from "@packages/types";

// @ts-ignore
const { VITE_API_URL } = import.meta.env as { [key: string]: string };

export function App() {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [dataArray, setDataArray] = React.useState<Page[] | null>(null);
  const [data, setData] = useAtom(pagesAtom);

  React.useEffect(() => {
    setSocket(io(VITE_API_URL, {}));
  }, [VITE_API_URL]);

  React.useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      socket.emit("get-data");
    });

    socket.on("data", (data: Page[]) => {
      setDataArray(data);
      setData(data);
    });

    socket.on("new-page", (data: Page) => {
      // @ts-ignore
      setDataArray((prev) => [...prev, data]);
    });

    socket.on("update-page", (data: Page) => {
      setDataArray(
        (
          prev // @ts-ignore
        ) => prev.map((item) => (item._id === data._id ? data : item))
      );
    });

    socket.on("delete-page", (data: Page) => {
      // @ts-ignore
      setDataArray((prev) => prev.filter((item) => item._id !== data._id));
    });

    socket.on(
      "new-content",
      ({ _id, content }: { _id: string; content: PageContent }) => {
        setDataArray((prev) => {
          // @ts-ignore
          const index = prev.findIndex((item) => item._id === _id); // @ts-ignore
          prev[index].content.push(content);
          return [...prev];
        });
      }
    );

    socket.on("update-content", ({ _id, content }) => {
      setDataArray((prev) => {
        // @ts-ignore
        const index = prev.findIndex((item) => item._id === _id); // @ts-ignore
        const contentIndex = prev[index].content.findIndex(
          (item) => item._id === content._id
        );
        // @ts-ignore
        prev[index].content[contentIndex] = content;
        return [...prev];
      });
    });

    socket.on("delete-content", ({ _id, content }) => {
      setDataArray((prev) => {
        // @ts-ignore
        const index = prev.findIndex((item) => item._id === _id); // @ts-ignore
        prev[index].content = prev[index].content.filter(
          (item) => item._id !== content._id
        );
        return [...prev];
      });
    });
  }, [socket]);

  // todo add loading fallback component
  return <Layout data={dataArray} />;
}
