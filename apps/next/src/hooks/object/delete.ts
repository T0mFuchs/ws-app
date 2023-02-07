import ky from "ky";

const { API_URL, CLIENT_URL } = process.env;

export async function deleteObject(data: any) {
  await ky
    .delete("delete", {
      json: data,
      prefixUrl: API_URL ?? "http://localhost:3000",
    })
    .json();
}
