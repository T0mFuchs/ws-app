import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useAtom } from "jotai";

import { useSprings, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import {} from "@/storage";

import type { Page } from "@packages/types";

export default function Table({ data }: { data: Page[] | null }) {
  return <></>;
}
