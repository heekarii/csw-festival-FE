/**
 * Waiting-list request body (TF / backend contract).
 * Queue position (연번) is assigned server-side; not sent by the client.
 */
export type ReservationRequestBody = {
  /** Contact info (phone, email, or combined string from the form) */
  contact: string;
  /** Number of guests */
  participantCount: number;
};

const DEFAULT_PATH = "/api/reservations";

function reservationUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";
  const path = import.meta.env.VITE_RESERVATION_PATH ?? DEFAULT_PATH;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/**
 * POST waiting registration; server is expected to respond with JSON `true` or `false`.
 */
export async function submitReservation(
  body: ReservationRequestBody,
): Promise<boolean> {
  const response = await fetch(reservationUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return false;
  }

  const data: unknown = await response.json();
  return data === true;
}