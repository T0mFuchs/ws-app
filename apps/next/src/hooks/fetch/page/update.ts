import ky from "ky";

import type { Page } from "@packages/types";

const API_URL = process.env.API_URL as string;

export async function updateOne({
  data,
}: {
  data: { _id: string; update: Page };
}) {
  await ky.put(`update`, {
    json: data,
    prefixUrl: `${API_URL}`,
    mode: "cors",
  });
}
