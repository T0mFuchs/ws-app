import ky from "ky";

const { API_URL, CLIENT_URL } = process.env;

export async function updateObject(data: any) {
  await ky.put("update", {
    json: data,
    prefixUrl: API_URL ?? "http://localhost:3000",
    mode: "cors",
  });
}
