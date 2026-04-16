import { getToken } from "@/utils/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1";

export class Api {
  static async request(
    url: string,
    method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
    body?: any,
  ) {
    const token = getToken(); // 🔥 lấy token tự động

    const res = await fetch(`${API_URL}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API Error");
    }

    return data;
  }

  static get(url: string) {
    return this.request(url, "GET");
  }

  static post(url: string, body: any) {
    return this.request(url, "POST", body);
  }

  static patch(url: string, body: any) {
    return this.request(url, "PATCH", body);
  }
}
