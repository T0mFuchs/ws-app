// @ts-nocheck
import React from "react";
import clsx from "clsx";

import { updateObject, deleteObject } from "@/hooks";


import type { ObjectType } from "@packages/types";

export default function Object({
  object,
  db,
  collection,
}: {
  object: ObjectType;
  db: string;
  collection: string;
}) {
  const [state, setState] = React.useState<ObjectType>(object);

  const onSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (state.name === "") {
      await deleteObject({
        data: { _id: state._id },
        db: db,
        collection: collection,
      });
      return;
    }
    if (state.name !== object.name || state.desc !== object.desc) {
      const target = evt.target as typeof evt.target & {
        name: { value: string };
        desc: { value: string };
      };
      await updateObject({
        data: {
          _id: state._id,
          update: {
            name: target.name.value,
            desc: target.desc.value,
          },
        },
        db: db,
        collection: collection,
      });
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} p-1>
        <label htmlFor="name" />
        <input
          bg-transparent
          border-1
          rounded
          name="name"
          title="name"
          placeholder="|"
          value={state.name ?? undefined}
          onChange={(evt) => setState({ ...state, name: evt.target.value })}
        />
        <label htmlFor="desc" />
        <input
          bg-transparent
          border-1
          rounded
          name="desc"
          title="description"
          placeholder="empty"
          value={state.desc ?? undefined}
          onChange={(evt) => setState({ ...state, desc: evt.target.value })}
        />
        <button
          type="submit"
          h-4
          ml-1
          disabled={
            object.name !== "" &&
            object.name === state.name &&
            object.desc === state.desc
          }
        />
      </form>
    </>
  );
}
