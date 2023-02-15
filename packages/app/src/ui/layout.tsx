import React from "react";

import { useSprings, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import Page from "./page";
import NewPage from "./page/new";

import type { Page as PageType } from "@packages/types";

const fn =
  (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
  (index: number) =>
    active && index === originalIndex
      ? {
          y: curIndex * 50 + y,
          scale: 1.1,
          zIndex: 1,
          shadow: 15,
          immediate: (key: string) => key === "zIndex",
          config: (key: string) =>
            key === "y" ? config.stiff : config.default,
        }
      : {
          y: order.indexOf(index) * 50,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false,
        };

const Modal = React.lazy(() => import("./modal"));
const Table = React.lazy(() => import("./table"));

export function Layout({ data }: { data: PageType[] | null }) {

  if (!data) return null;


  const initialOrder = React.useRef(data?.map((_, index) => index));
  const [order, setOrder] = React.useState(initialOrder.current);

  
  // @ts-ignore
  const [springs, api] = useSprings(data?.length, fn(order));
  const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
    // @ts-ignore
    const curIndex = order.indexOf(originalIndex);
    const curRow = curIndex + (y < 0 ? -1 : y > 0 ? 1 : 0); // @ts-ignore
    const newOrder = [...order]; // @ts-ignore
    newOrder.splice(curIndex, 1);
    newOrder.splice(curRow, 0, originalIndex);
    api.start(fn(newOrder, active, originalIndex, curIndex, y));
    if (!active) setOrder(newOrder);
  });


  return (
    <div className="grid gap-2 p-4">
      <>
        {data ? (
          <>
            <div grid justify-end>
              {springs.map(({ zIndex, y, scale }, i) => (
                <animated.div
                  {...bind(i)}
                  key={i}
                  style={{
                    zIndex: zIndex,
                    y: y,
                    scale: scale,
                  }}
                  fixed
                >
                  <Page page={data[i]} index={order[i]} />
                </animated.div>
              ))}
              <NewPage index={data.length} />
            </div>
            <>
              <React.Suspense fallback={<></>}>
                <Modal />
              </React.Suspense>
            </>
            <>
              <React.Suspense fallback={<></>}>
                <Table data={data} />
              </React.Suspense>
            </>
          </>
        ) : null}
      </>
    </div>
  );
}
