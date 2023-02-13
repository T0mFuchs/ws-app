import ky from "ky";

import type { Page } from "@packages/types";

// @ts-ignore
const { VITE_API_URL } = import.meta.env;

export async function createOne({ data }: { data: Page }) {
  await ky.post(`create`, {
    json: data,
    prefixUrl: `${VITE_API_URL}`,
    mode: "cors",
  });
}
