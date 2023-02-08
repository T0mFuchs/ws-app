import ky from "ky";

const API_URL = process.env.API_URL as string;

export async function deleteObject({
  data,
  db,
  collection,
}: {
  data: { _id: string };
  db: string;
  collection: string;
}) {
  await ky.delete(`delete`, {
    json: data,
    prefixUrl: `${API_URL}/${db}/${collection}`,
    mode: "cors",
  });
}
