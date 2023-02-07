import ky from "ky";

const { API_URL, CLIENT_URL } = process.env;

// why is url undefined here :(

export async function createObject(data: any) {
  return await ky
    .post(`create`, {
      json: data,
      prefixUrl: API_URL ?? "http://localhost:3000",
    })
    .json();
}
