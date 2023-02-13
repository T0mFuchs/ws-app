import React from "react";
import AutosizeInput from "react-input-autosize";
import clsx from "clsx";
import { useAtom } from "jotai";

import { pageAtom, modalOpenAtom } from "@/storage";
import { updateOne } from "@/hooks";
import { deleteOneById } from "@/hooks";

import type { Page } from "@packages/types";

import Content from "./content";
import NewContent from "./content/new";

export default function Page({ page }: { page: Page }) {

  const [modalOpen, setModalOpen] = useAtom(modalOpenAtom);
  const [sharedPage, setSharedPage] = useAtom(pageAtom);

  React.useEffect(() => {
    if (page) setSharedPage(page);
  }, [page]);

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
      if (page.name !== sharedPage?.name || page.desc !== sharedPage?.desc) {
        await updateOne({
          data: {
            // @ts-ignore
            _id: page._id,
            update: {
              name: page.name !== sharedPage?.name ? sharedPage?.name : page?.name,
              desc: page.desc !== sharedPage?.desc ? sharedPage?.desc : page?.desc,
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
    // todo fix logic for this
    "bg-transparent border-0":
    page?.name === sharedPage?.name && page?.desc === sharedPage?.desc,
    "i-mdi-file-document-edit-outline hover:text-teal-500 focus:text-teal-500":
      (sharedPage?.name !== "" && page?.name !== sharedPage?.name) ||
      page?.desc !== sharedPage?.desc,
    "i-mdi-file-document-remove-outline text-red": sharedPage?.name === "",
  });

  if (!page) return null;
  return (
    <>
      <form onSubmit={onSubmit} className="p-1">
        <label htmlFor="clr" />
        <input
          className="i-mdi-file mr-1"
          type="color"
          name="clr"
          value={sharedPage && sharedPage._id === page?._id ? sharedPage.clr : page?.clr}
          onChange={(evt: any) => {
            setSharedPage({ ...page, clr: evt.target.value });
            submitClr();
          }}
          style={{ color: page?.clr ?? "var(--text)" }}
        />
        <label htmlFor="name" />
        <AutosizeInput
          className="border-1 rounded bg-transparent"
          name="name"
          placeholder="|"
          value={sharedPage && sharedPage._id === page?._id ? sharedPage.name : page?.name}
          onChange={(evt: any) => setSharedPage({ ...page, name: evt.target.value })}
        />
        <label htmlFor="desc" />
        <AutosizeInput
          className="border-1 rounded bg-transparent"
          name="desc"
          placeholder="empty"
          value={sharedPage && sharedPage._id === page?._id ? sharedPage.desc : page?.desc}
          onChange={(evt) => setSharedPage({ ...page, desc: evt.target.value })}
        />
        <button
          type="submit"
          disabled={page?.name === sharedPage?.name && page?.desc === sharedPage?.desc}
          className={btnStyle}
          ml-1
        />
      </form>
      <div className="p-1">
        <button
          disabled={page?._id === sharedPage?._id && modalOpen}
          onClick={() => {
            setSharedPage(page);
            setModalOpen(true);
          }}
        >
          open
        </button>
      </div>
      <div pl-6 px-1>
        {page?.content?.map(
          (
            i, index: number 
          ) => (
            <>
              {/* @ts-ignore */}
              <Content item={i} index={index} pageId={page._id} />
            </>
          )
        )}
        {/* @ts-ignore */}
        <NewContent pageId={page._id} />
      </div>
    </>
  );
}
