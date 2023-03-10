import React from "react";
import AutosizeInput from "react-input-autosize";
import clsx from "clsx";

import { createOne } from "@/hooks";

import type { Page } from "@packages/types";

export default function NewPage({ index }: { index: number }) {
  const [page, setPage] = React.useState<Page | null>(null);

  const onSubmit = async (evt: any) => {
    evt.preventDefault();
    await createOne({ data: { i: index, ...page } });
    setPage(null);
  };

  const btnStyle = clsx({
    "bg-transparent border-0": !page?.name,
    "i-mdi-file-document-plus-outline hover:text-teal-500 focus:text-teal-500":
      page?.name,
  });

  return (
    <>
      <form onSubmit={onSubmit} className="p-1">
        <label htmlFor="clr" />
        <input
          className="i-mdi-file-outline mr-1"
          type="color"
          name="clr"
          value={page?.clr ?? undefined}
          onChange={(evt: any) => setPage({ ...page, clr: evt.target.value })}
          style={{ color: page?.clr ?? "var(--text)" }}
        />
        <label htmlFor="name" />
        <AutosizeInput
          className="bg-transparent border-1 rounded"
          name="name"
          placeholder="name"
          value={page?.name ?? ""}
          onChange={(evt) => setPage({ ...page, name: evt.target.value })}
        />
        <label htmlFor="desc" />
        <AutosizeInput
          className="border-1 rounded bg-transparent"
          name="desc"
          placeholder="description"
          value={page?.desc ?? ""}
          onChange={(evt) => setPage({ ...page, desc: evt.target.value })}
        />
        <button type="submit" className={btnStyle + " ml-1"} />
      </form>
    </>
  );
}
