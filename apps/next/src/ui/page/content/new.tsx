// @ts-nocheck
import React from "react";
import clsx from "clsx";

import { updateOne } from "@/hooks/fetch/page";

import { PageContent } from "@packages/types";

export default function NewContent({ pageId }: { pageId: string }) {
  const [content, setContent] = React.useState<PageContent | null>(null);

  const onSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (content) {
      await updateOne({
        data: {
          _id: pageId,
          update: {
            content: {
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
      <form onSubmit={onSubmit} p-1>
        <label htmlFor="value" />
        <input
          rounded
          border-0
          name="value"
          placeholder="|"
          value={content?.value ?? ""}
          onChange={(evt) =>
            setContent({ ...content, value: evt.target.value })
          }
        />
      </form>
    </>
  );
}
