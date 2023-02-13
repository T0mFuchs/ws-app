// @ts-nocheck
import React from "react";
import clsx from "clsx";
import { Separator } from "@radix-ui/react-separator";
import { useAtom } from "jotai";

import Content from "./page/content";
import NewContent from "./page/content/new";

import { pageAtom, pagesAtom, pageIndexAtom, modalOpenAtom } from "@/storage";

export default function Modal() {
  const [modalOpen, setModalOpen] = useAtom(modalOpenAtom);
  const [page, setPage] = useAtom(pageAtom);
  const [data, setData] = useAtom(pagesAtom);
  const [pageIndex, setPageIndex] = useAtom(pageIndexAtom);

  React.useEffect(() => {
    console.log("modal-page: ", page);
  }, [page]);

  const ref = React.useRef(null);
  const refLeft = React.useRef(null);
  const refLeftSeparator = React.useRef(null);

  React.useEffect(() => {
    if (modalOpen) {
      const modalDiv = ref.current;
      const separator = refLeftSeparator.current;
      const styles = window.getComputedStyle(modalDiv);

      let width = parseInt(styles.width, 10);
      let x = 0;

      const onPointerMoveLeftResize = (evt) => {
        const dx = evt.clientX - x;
        x = evt.clientX;
        width = width - dx;
        modalDiv.style.width = `${width}px`;
      };
      const onPointerUpLeftResize = (evt) => {
        document.removeEventListener("pointermove", onPointerMoveLeftResize);
        separator.style.width = "1px";
        separator.style.backgroundColor = "#262626";
      };
      const onPointerDownLeftResize = (evt) => {
        x = evt.clientX;
        modalDiv.style.left = null;
        separator.style.width = "5px";
        separator.style.backgroundColor = "#1d4ed8"; // tailwindcss blue-700
        document.addEventListener("pointermove", onPointerMoveLeftResize);
        document.addEventListener("pointerup", onPointerUpLeftResize);
        //! this is pretty unusable for mobile devices but modal for mobile is default full screen anyways
        // todo :: make mobile default full screen
      };
      const resizerLeft = refLeft.current;
      resizerLeft.addEventListener("pointerdown", onPointerDownLeftResize);
      return () => {
        resizerLeft.removeEventListener("pointerdown", onPointerDownLeftResize);
      };
    }
  }, [modalOpen]);

  return (
    <>
      {modalOpen && page ? (
        <div className="fixed z-1 right-0">
          <div style={{ backgroundColor: "var(--bg)" }} ref={ref}>
            <div
              className="absolute w-2 cursor-col-resize ml--1 h=100vmax"
              ref={refLeft}
            >
              <Separator
                relative
                w="1px"
                h="100vmax"
                bg-neutral-800
                ml-1
                orientation="vertical"
                ref={refLeftSeparator}
              />
            </div>
            <div p-1 pb-2 flex gap-2>
              <button
                i-mdi-close
                relative
                top-1
                focus:bg-red
                hover:bg-red
                title="close"
                onClick={() => setModalOpen(false)}
              />
              <button
                i-mdi-arrow-collapse
                relative
                top-1
                left--1
                focus:bg-red
                hover:bg-red
                title="collapse"
                onClick={() => (ref.current.style.width = "fit-content")}
              />
              <button
                i-mdi-arrow-collapse-horizontal
                relative
                top-1
                left--1
                focus:bg-red
                hover:bg-red
                title="split"
                onClick={() => (ref.current.style.width = "50vw")}
              />
              <button
                i-mdi-menu-up-outline
                relative
                top-1
                focus:animate-pulse
                title="previous page"
                disabled={pageIndex === 0}
                onClick={() => {
                  setPage(data[pageIndex - 1]);
                  setPageIndex(pageIndex - 1);
                }}
              />
              <button
                i-mdi-menu-down-outline
                relative
                top-1
                focus:animate-pulse
                title="next page"
                disabled={pageIndex === data.length - 1}
                onClick={() => {
                  setPage(data[pageIndex + 1]);
                  setPageIndex(pageIndex + 1);
                }}
              />
              <button
                i-mdi-fullscreen
                relative
                top-1
                left--1
                focus:bg-red
                hover:bg-red
                title="full"
                onClick={() => (ref.current.style.width = "100vw")}
              />
            </div>
            <div className="p-1" grid gap-1>
              <form className="p-1">
                <input
                  name="name"
                  value={page?.name}
                  onChange={(evt) => {
                    setPage({
                      ...page,
                      name: evt.target.value,
                    });
                  }}
                />
              </form>
              <div className="p-1">{page?.description}</div>
              <div p-1>
                {page?.content?.map((item, i) => (
                  <Content item={item} index={i} pageId={page._id} />
                ))}
                <NewContent pageId={page._id} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
