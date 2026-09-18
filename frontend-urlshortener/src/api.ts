export interface Link {
  id: number;
  code: string;
  original_url: string;
  click_count: number;
  created_at: string;
  short_url?: string;
}

const BASE_URL = "/api/shorten";

export async function fetchLinks(): Promise<Link[]> {
  const res = await fetch(`${BASE_URL}/links`);
  if (!res.ok) throw new Error("failed to fetch links");
  return res.json();
}

export async function createLink(url: string): Promise<Link> {
  const res = await fetch(`${BASE_URL}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "failed to create link");
  }
  return res.json();
}
