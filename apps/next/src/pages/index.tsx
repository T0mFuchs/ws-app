//@ts-nocheck
import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { io } from "socket.io-client";

import type { GetServerSideProps } from "next";
import type { ObjectType } from "@packages/types";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      API_URL: process.env.API_URL as string,
    },
  };
};

const Object = dynamic(() => import("@/ui/object"));
const NewObject = dynamic(() => import("@/ui/object/new"));

export default function Home({ API_URL }: { API_URL: string }) {
  const [stateArray, setStateArray] = React.useState<ObjectType[] | null>(null);
  const [db, setDb] = React.useState<string>("db1");
  const [collection, setCollection] = React.useState<string>("collection1");
  const [rerender, setRerender] = React.useState<boolean>(false);

  
  React.useState(() => {
    
    const socket = io(API_URL);

    //* socket connection event
    socket.on("connect", () => {
      //* emit get-data event to server
      socket.emit("get-data", { db: db, collection: collection });
    });

    //* receive data from server
    socket.on("data", (data: ObjectType[]) => {
      setStateArray(data);
    });

    //* on new-object append data received to stateArray
    socket.on("new-object", (data: ObjectType) => {
      setStateArray((prevState: ObjectType[]) => [...prevState, data]);
    });

    //* on updated-object update stateArray
    socket.on("updated-object", (data: ObjectType) => {
      setStateArray((prevState: ObjectType[]) => {
        setStateArray(
          prevState.map((item: ObjectType) => {
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
    socket.on("deleted-object", (data: { _id: string }) => {
      setStateArray((prevState: ObjectType[]) =>
        prevState.filter((item: ObjectType) => item._id !== data._id)
      );
    });

    return () => socket.off("data");

  });

  React.useEffect(() => {
    if (rerender) {
      const socket = io(API_URL);
      //* receive data from the onSubmit triggered event
        socket.on("data", (data: ObjectType[]) => {
          setStateArray(data);
          setRerender(false);
        })
    }
  }, [rerender, API_URL]);  

  const onSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    const socket = io(API_URL);
    // todo :: check for bad db or collection inputs (must start&end with letter or number, no empty inputs, etc.)
    socket.on("connect", () => {
      socket.emit("get-data", { db: db, collection: collection });
      setRerender(true);
    })
    return () => socket.off("connect");
  };

  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="" />
        <link rel="icon" href="/empty.svg" />
      </Head>

      <form onSubmit={onSubmit} p-1>
          <label htmlFor="db" />
          <input
            name="db"
            placeholder="db"
            value={db}
            onChange={(evt) => setDb(evt.target.value)}
          />
          <label htmlFor="collection" />
          <input
            name="collection"
            placeholder="collection"
            value={collection}
            onChange={(evt) => setCollection(evt.target.value)}
          />
          <button type="submit" h-4 ml-1 />
        </form>
      <main grid justify-center pt-8>
        <React.Suspense>
          {stateArray ? (
            <>
              {stateArray.map((item: ObjectType) => (
                <div key={item._id}>
                  <Object db={db} collection={collection} object={item} />
                </div>
              ))}
            </>
          ) : null}
          <NewObject db={db} collection={collection} />
        </React.Suspense>
      </main>
    </>
  );
}
