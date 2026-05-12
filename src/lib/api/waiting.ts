/**
 * Waiting-list POST body (ported from feature/reservation-page API contract).
 * Queue order (연번) is server-side; not sent by the client.
 */
export type WaitingRequestBody = {
  contact: string;
  participantCount: number;
};

const DEFAULT_PATH = "api/reservations";

function waitingSubmitUrl(): string {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
  const path = (process.env.NEXT_PUBLIC_WAITING_PATH ?? DEFAULT_PATH).replace(
    /^\/+/,
    "",
  );
  if (!base) {
    return `/${path}`;
  }
  return `${base}/${path}`;
}

/**
 * POST waiting registration; server should respond with JSON literal true or false.
 */
export async function submitWaiting(
  body: WaitingRequestBody,
): Promise<boolean> {
  const response = await fetch(waitingSubmitUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) {
    return false;
  }
  const data: unknown = await response.json();
  return data === true;
}