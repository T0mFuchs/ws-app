import { atom } from "jotai";
import type { Page } from "@packages/types";

export const pageAtom = atom<Page | null>(null);
export const pagesAtom = atom<Page[]>([]);
export const pageIndexAtom = atom<number>(0);
