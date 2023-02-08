import ky from "ky";

import type { ObjectType } from "@packages/types";

const API_URL = process.env.API_URL as string;

export async function createObject({
  data,
  db,
  collection,
}: {
  data: ObjectType;
  db: string;
  collection: string;
}) {
  await ky.post(`create`, {
    json: data,
    prefixUrl: `${API_URL}/${db}/${collection}`,
    mode: "cors",
  });
}
