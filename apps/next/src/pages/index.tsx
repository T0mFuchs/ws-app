import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { io } from "socket.io-client";

import type { GetServerSideProps } from "next";
import type { Socket } from "socket.io-client";
import type { PageContent, Page } from "@packages/types";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      API_URL: process.env.API_URL as string,
    },
  };
};

const Page = dynamic(() => import("@/ui/page"));
const NewPage = dynamic(() => import("@/ui/page/new"));

export default function Home({ API_URL }: { API_URL: string }) {
  // todo :: pass socket as prop to page component so the socket instance becomes reusable

  const [socket, setSocket] = React.useState<Socket | null>(null);

  const [dataArray, setDataArray] = React.useState<Page[] | null>(null);

  React.useEffect(() => {
    if (dataArray) console.log("stateArray: ", dataArray);
  }, [dataArray]);

  //* on mount set socket
  React.useEffect(() => {
    setSocket(io(API_URL, {}));
  }, [API_URL]);

  React.useEffect(() => {
    if (!socket) return;

    //* socket connection event
    socket.on("connect", () => {
      //* emit get-data event to server
      socket.emit("get-data");
    });

    //* on receiving data from server set state
    socket.on("data", (data: Page[]) => {
      setDataArray(data);
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

  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="" />
        <link rel="icon" href="/empty.svg" />
      </Head>

      <div grid justify-center px-6 py-3 gap-1>
        <React.Suspense>
          {dataArray?.map((item) => (
            <div key={item._id}>
              <Page item={item} />
            </div>
          ))}
          <NewPage />
        </React.Suspense>
      </div>
    </>
  );
}
