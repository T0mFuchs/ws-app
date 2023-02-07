// @ts-nocheck
import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { io } from "socket.io-client";

import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      API_URL: process.env.API_URL,
    },
  };
};

const Object = dynamic(() => import("@/ui/object"));
const NewObject = dynamic(() => import("@/ui/object/new"));

export default function Home({ API_URL }: { API_URL: string }) {
  const [stateArray, setStateArray] = React.useState<any | null>(null);

  React.useState(() => {
    const socket = io(API_URL);

    //* socket connection event
    socket.on("connect", () => {
      //* emit get-data event to server
      socket.emit("get-data");
    });

    //* receive initial data from server
    socket.on("data", (data: any) => {
      setStateArray(data);
    });

    //* on new-object append data received to stateArray
    socket.on("new-object", (data: any) => {
      setStateArray((prevState: any) => [...prevState, data]);
    });

    //* on updated-object update stateArray
    socket.on("updated-object", (data: any) => {
      setStateArray((prevState: any) => {
        setStateArray(
          prevState.map((item: any) => {
            if (item._id === data._id) {
              return {
                ...item,
                ...data,
              };
            } else {
              return item;
            }
          })
        );
      });
    });

    //* on deleted-object remove deleted object from stateArray
    socket.on("deleted-object", (data: any) => {
      // @ts-ignore @ts-expect-error
      setStateArray(stateArray?.filter((item: any) => item._id !== data._id));
    });
  });

  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="" />
        <link rel="icon" href="/empty.svg" />
      </Head>

      <main grid justify-center>
        <React.Suspense>
          {stateArray ? (
            <>
              {stateArray.map((item: any) => (
                <div key={item._id}>
                  <Object object={item} />
                </div>
              ))}
            </>
          ) : null}
          <NewObject />
        </React.Suspense>
      </main>
    </>
  );
}
