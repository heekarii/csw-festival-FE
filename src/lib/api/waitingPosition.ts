/**
 * Waiting queue position lookup (see docs/API_WAITING.md).
 */

const DEFAULT_PATH = "waiting/position";

function positionUrl(): string {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
  const path = (
    process.env.NEXT_PUBLIC_WAITING_POSITION_PATH ?? DEFAULT_PATH
  ).replace(/^\/+/, "");
  if (!base) {
    return `/${path}`;
  }
  return `${base}/${path}`;
}

export type QueuePositionResult =
  | { ok: true; queueNumber: number }
  | { ok: false; queueNumber: null };

function parseQueuePosition(data: unknown): QueuePositionResult {
  if (typeof data !== "object" || data === null) {
    return { ok: false, queueNumber: null };
  }
  const o = data as Record<string, unknown>;
  if (o.result === false) {
    return { ok: false, queueNumber: null };
  }
  const n = o.queueNumber;
  if (typeof n === "number" && Number.isFinite(n) && n >= 1) {
    return { ok: true, queueNumber: Math.floor(n) };
  }
  return { ok: false, queueNumber: null };
}

/**
 * POST with `{ phone }` to retrieve this customer's waiting order (연번 / queue index).
 */
export async function fetchWaitingQueuePosition(
  phone: string,
): Promise<QueuePositionResult> {
  const response = await fetch(positionUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
    cache: "no-store",
  });
  if (!response.ok) {
    return { ok: false, queueNumber: null };
  }
  const data: unknown = await response.json();
  return parseQueuePosition(data);
}