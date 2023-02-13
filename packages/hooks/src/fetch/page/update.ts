import ky from "ky";

import type { Page } from "@packages/types";

// @ts-ignore
const { VITE_API_URL } = import.meta.env;

export async function updateOne({
  data,
}: {
  data: { _id: string; update: Page };
}) {
  await ky.put(`update`, {
    json: data,
    prefixUrl: `${VITE_API_URL}`,
    mode: "cors",
  });
}
