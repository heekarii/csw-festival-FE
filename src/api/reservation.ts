/**
 * Waiting-list request body (TF / backend contract).
 * Adjust path via VITE_RESERVATION_PATH when the real endpoint is fixed.
 */
export type ReservationRequestBody = {
  /** Contact info (phone, email, or combined string from the form) */
  contact: string;
  /** Number of guests */
  participantCount: number;
  /** Sequence number (연번); replaces former visit-time field in the contract */
  sequenceNumber: number;
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