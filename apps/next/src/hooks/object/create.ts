import ky from "ky";

const { API_URL, CLIENT_URL } = process.env;

export async function createObject(data: any) {
  await ky.post(`create`, {
    json: data,
    prefixUrl: API_URL ?? "http://localhost:3000",
    mode: "cors",
  });
}
