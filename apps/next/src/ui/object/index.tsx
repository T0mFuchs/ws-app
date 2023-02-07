// @ts-nocheck
import React from "react";

import { updateObject } from "@/hooks/object";
import { deleteObject } from "@/hooks/object";

export default function Object({ object }: { object: any }) {
  const [state, setState] = React.useState(object);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    if (state.name !== object.name || state.desc !== object.desc) {
      await updateObject({
        _id: state._id,
        update: {
          name: evt.target.name.value,
          desc: evt.target.desc.value,
        },
      });
    }
    if (state.name === "") {
      await deleteObject({ _id: state._id });
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
          placeholder="name"
          value={state.name}
          onChange={(evt) => setState({ ...state, name: evt.target.value })}
        />
        <label htmlFor="desc" />
        <input
          bg-transparent
          border-1
          rounded
          name="desc"
          placeholder="description"
          value={state.desc}
          onChange={(evt) => setState({ ...state, desc: evt.target.value })}
        />
        <button type="submit" h-4 ml-1 />
      </form>
    </>
  );
}
