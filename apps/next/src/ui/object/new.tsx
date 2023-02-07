// @ts-nocheck
import React from "react";

import { createObject } from "@/hooks/object";

export default function NewObject() {
  const [object, setObject] = React.useState<any | null>(null);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    await createObject({
      name: evt.target.name.value,
      desc: evt.target.desc.value,
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
          value={object?.name}
          onChange={(evt) => setObject({ ...object, name: evt.target.value })}
        />
        <label htmlFor="desc" />
        <input
          bg-transparent
          border-1
          rounded
          name="desc"
          placeholder="description"
          value={object?.desc}
          onChange={(evt) => setObject({ ...object, desc: evt.target.value })}
        />
        <button type="submit" h-4 ml-1 />
      </form>
    </>
  );
}
