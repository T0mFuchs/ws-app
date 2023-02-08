// @ts-nocheck
import React from "react";
import clsx from "clsx";

import { createObject } from "@/hooks";

import type { ObjectType } from "@packages/types";

export default function NewObject({
  db,
  collection,
}: {
  db: string;
  collection: string;
}) {
  const [object, setObject] = React.useState<ObjectType | null>(null);

  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    const target = evt.target as typeof evt.target & {
      name: { value: string };
      desc: { value: string };
    };
    await createObject({
      data: {
        name: target.name.value,
        desc: target.desc.value,
      },
      db: db,
      collection: collection,
    });
    setObject(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} p-1>
        <label htmlFor="name" />
        <input
          bg-transparent
          border-1
          rounded
          name="name"
          placeholder="name"
          value={object?.name ?? ""}
          onChange={(evt) => setObject({ ...object, name: evt.target.value })}
        />
        <label htmlFor="desc" />
        <input
          bg-transparent
          border-1
          rounded
          name="desc"
          placeholder="description"
          value={object?.desc ?? ""}
          onChange={(evt) => setObject({ ...object, desc: evt.target.value })}
        />
        <button type="submit" h-4 ml-1 />
      </form>
    </>
  );
}
