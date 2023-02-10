import ky from "ky";

const API_URL = process.env.API_URL as string;

export async function deleteOneById({ data }: { data: { _id: string } }) {
  await ky.delete(`delete`, {
    json: data,
    prefixUrl: `${API_URL}`,
    mode: "cors",
  });
}
