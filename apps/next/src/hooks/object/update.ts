import ky from "ky";

import type { ObjectType } from "@packages/types";

const API_URL = process.env.API_URL as string;

export async function updateObject({
  data,
  db,
  collection,
}: {
  data: ObjectType;
  db: string;
  collection: string;
}) {
  await ky.put(`update`, {
    json: data,
    prefixUrl: `${API_URL}/${db}/${collection}`,
    mode: "cors",
  });
}
