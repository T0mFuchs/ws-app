import React from "react";
import clsx from "clsx";

import { updateOne } from "@packages/hooks";
import { deleteOneById } from "@packages/hooks";

import type { PageContent } from "@packages/types";

export default function Content({
  item,
  pageId,
}: {
  item: PageContent;
  pageId: string;
}) {
  const [content, setContent] = React.useState<PageContent | null>(null);

  React.useEffect(() => {
    if (item) setContent(item);
  }, [item]);

  const onSubmit = async (evt: any) => {
    evt.preventDefault();
    if (content) {
      if (content.value === "") {
        await deleteOneById({
          data: {
            _id: pageId,
            // @ts-ignore
            content: {
              _id: content._id,
            },
          },
        });
        return;
      }
      if (content.value !== item.value) {
        await updateOne({
          data: {
            _id: pageId,
            update: {
              // @ts-ignore
              content: {
                ...content,
              },
            },
          },
        });
      }
    }
  };

  return (
    <>
      {/* @ts-ignore */}
      <form onSubmit={onSubmit} p-1>
        <label htmlFor="" />
        <input
          rounded
          border-0
          name="value"
          placeholder="|"
          value={content?.value ?? ""}
          className={content?.style}
          onChange={(evt: any) =>
            setContent({ ...content, value: evt.target.value })
          }
        />
      </form>
    </>
  );
}
