import ky from "ky";

// @ts-ignore
const { VITE_API_URL } = import.meta.env;

export async function deleteOneById({ data }: { data: { _id: string } }) {
  await ky.delete(`delete`, {
    json: data,
    prefixUrl: `${VITE_API_URL}`,
    mode: "cors",
  });
}
