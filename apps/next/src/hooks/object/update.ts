import ky from "ky";

const { API_URL, CLIENT_URL } = process.env;

export async function updateObject(data: any) {
  await ky
    .put("update", {
      json: data,
      prefixUrl: API_URL ?? "http://localhost:3000",
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            "Content-Type": "application/json",
            "Origin": CLIENT_URL ?? "http://localhost:3001",
          },
        });
      },
    });
}
