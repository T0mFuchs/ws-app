import React from "react";
import clsx from "clsx";

import { updateOne } from "@/hooks";

import { PageContent } from "@packages/types";

export default function NewContent({ pageId }: { pageId: string }) {
  const [content, setContent] = React.useState<PageContent | null>(null);

  const onSubmit = async (evt: any) => {
    evt.preventDefault();
    if (content) {
      await updateOne({
        data: {
          _id: pageId,
          update: {
            content: {
              // @ts-ignore
              value: content.value,
              style: "d",
            },
          },
        },
      });
      setContent(null);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="p-1">
        <label htmlFor="value" />
        <input
          className="border-0 rounded"
          name="value"
          placeholder="|"
          value={content?.value ?? ""}
          onChange={(evt: any) =>
            setContent({ ...content, value: evt.target.value })
          }
        />
      </form>
    </>
  );
}
