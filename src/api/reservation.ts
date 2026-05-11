/**
 * Request body for reservation submission (TF / backend contract).
 */
export type ReservationRequestBody = {
  contact: string;
  participantCount: number;
};

const DEFAULT_PATH = "/api/reservations";

function reservationUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";
  const path = import.meta.env.VITE_RESERVATION_PATH ?? DEFAULT_PATH;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

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