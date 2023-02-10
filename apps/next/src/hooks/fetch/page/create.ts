import ky from "ky";

import type { PageType } from "@packages/types";

const API_URL = process.env.API_URL as string;

export async function createOne({ data }: { data: PageType }) {
  await ky.post(`create`, {
    json: data,
    prefixUrl: `${API_URL}`,
    mode: "cors",
  });
}
