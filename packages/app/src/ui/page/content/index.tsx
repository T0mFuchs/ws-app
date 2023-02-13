// @ts-nocheck
import React from "react";
import clsx from "clsx";
import { useAtom } from "jotai";
import { pageAtom } from "@/storage";

import { updateOne } from "@/hooks";
import { deleteOneById } from "@/hooks";

import type { PageContent } from "@packages/types";

export default function Content({
  item,
  index,
  pageId,
}: {
  item: PageContent;
  index: number;
  pageId: string;
}) {

  const [page, setPage] = useAtom(pageAtom)

  React.useEffect(() => {
    if (item) setPage((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        content: prev?.content?.map((content, i) => {
          if (i === index) return item;
          return content;
        })
      }
    });
  }, [item]);

  const onSubmit = async (evt: any) => {
    evt.preventDefault();
    if (page && page.content[index]) {
      if (page?.content[index]?.value === "") {
        await deleteOneById({
          data: {
            _id: pageId,
            // @ts-ignore
            content: {
              _id: page.content[index]._id,
            },
          },
        });
        return;
      }
      if (page?.content[index]?.value !== item.value) {
        await updateOne({
          data: {
            _id: pageId,
            update: {
              // @ts-ignore
              content: {
                ...page?.content[index],
              },
            },
          },
        });
      }
    }
  };

  if (!item) return null;
  return (
    <>
      {/* @ts-ignore */}
      <form onSubmit={onSubmit} className="p-1">
        <label htmlFor="" />
        <input
          name="value"
          placeholder="|"
          value={page && page._id === pageId ? page?.content[index]?.value : item?.value}
          className={`${page && page._id === pageId ? page?.content[index]?.style : item?.style} border-0 rounded`}
          onChange={(evt: any) => {
            return setPage((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                content: prev.content.map((item, i) => {
                  if (i === index) return { ...item, value: evt.target.value };
                  return item;
                }),
              };
            })
          }}
        />
      </form>
    </>
  );
}
