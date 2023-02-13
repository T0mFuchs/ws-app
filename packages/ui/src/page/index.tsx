import React from "react";
import AutosizeInput from "react-input-autosize";
import clsx from "clsx";

import { updateOne } from "@packages/hooks";
import { deleteOneById } from "@packages/hooks";

import type { Page } from "@packages/types";

import Content from "./content";
import NewContent from "./content/new";

export default function Page({ item }: { item: Page }) {
  const [page, setPage] = React.useState<Page | null>(null);

  React.useEffect(() => {
    if (item) setPage(item);
  }, [item]);

  const onSubmit = async (evt: any) => {
    evt.preventDefault();
    if (page) {
      if (page.name === "") {
        await deleteOneById({
          data: {
            // @ts-ignore
            _id: page._id,
          },
        });
        return;
      }
      if (page.name !== item.name || page.desc !== item.desc) {
        await updateOne({
          data: {
            // @ts-ignore
            _id: page._id,
            update: {
              name: page.name !== item.name ? page.name : undefined,
              desc: page.desc !== item.desc ? page.desc : undefined,
            },
          },
        });
      }
    }
  };

  const submitClr = async () => {
    //? triggers onChange @<input name="clr" />
    // so that user doesnt have click submit or hit enter to save color
    // todo :: custom color picker with last 3-5 used colors depending on whether its mobile or not
    if (page) {
      await updateOne({
        data: {
          // @ts-ignore
          _id: page._id,
          update: { clr: page.clr },
        },
      });
    }
  };

  const btnStyle = clsx({
    "bg-transparent border-0":
      item.name === page?.name && item.desc === page?.desc,
    "i-mdi-file-document-edit-outline hover:text-teal-500 focus:text-teal-500":
      (page?.name !== "" && item.name !== page?.name) ||
      item.desc !== page?.desc,
    "i-mdi-file-document-remove-outline text-red": page?.name === "",
  });

  return (
    <>
      <form onSubmit={onSubmit} p-1>
        <label htmlFor="clr" />
        <input
          i-mdi-file
          mr-1
          type="color"
          name="clr"
          value={page?.clr ?? undefined}
          onChange={(evt: any) => {
            setPage({ ...page, clr: evt.target.value });
            submitClr();
          }}
          style={{ color: page?.clr ?? "var(--text)" }}
        />
        <label htmlFor="name" />
        <AutosizeInput
          bg-transparent
          border-1 // @ts-ignore
          rounded
          name="name"
          placeholder="|"
          value={page?.name ?? ""}
          onChange={(evt: any) => setPage({ ...page, name: evt.target.value })}
        />
        <label htmlFor="desc" />
        <AutosizeInput
          bg-transparent
          border-1 // @ts-ignore
          rounded
          name="desc"
          placeholder="empty"
          value={page?.desc ?? undefined}
          onChange={(evt) => setPage({ ...page, desc: evt.target.value })}
        />
        <button
          type="submit"
          disabled={item.name === page?.name && item.desc === page?.desc}
          className={btnStyle}
          ml-1
        />
      </form>
      <div pl-6 px-1>
        {page?.content?.map(
          (
            i 
          ) => ( // @ts-ignore
            <Content item={i} pageId={item._id} />
          )
        )}
        {/* @ts-ignore */}
        <NewContent pageId={item._id} />
      </div>
    </>
  );
}
