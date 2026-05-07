export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Reservation = {
  id: number;
  phoneNumber: string;
  peopleCount: number;
  createdAt?: string;
};

async function fetchReservations(): Promise<Reservation[]> {
  const res = await fetch(`${API_BASE}/reservations`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("예약자 정보를 불러오지 못했습니다.");
  }

  return res.json();
}

export default async function ReservationsPage() {
  const reservations = await fetchReservations();

  const totalPeopleCount = reservations.reduce(
    (sum, reservation) => sum + reservation.peopleCount,
    0
  );

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">예약자 관리</h1>
        <p className="text-gray-600">
          예약자의 연락처와 예약 인원수를 확인하는 페이지입니다.
        </p>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">총 예약 건수</p>
          <p className="text-2xl font-bold">{reservations.length}건</p>
        </div>

        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">총 예약 인원</p>
          <p className="text-2xl font-bold">{totalPeopleCount}명</p>
        </div>
      </div>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">번호</th>
            <th className="border px-4 py-2">연락처</th>
            <th className="border px-4 py-2">인원수</th>
            <th className="border px-4 py-2">예약 시간</th>
          </tr>
        </thead>

        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td className="border px-4 py-6 text-center" colSpan={4}>
                아직 예약자가 없습니다.
              </td>
            </tr>
          ) : (
            reservations.map((reservation, index) => (
              <tr key={reservation.id}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2 text-center">
                  {reservation.phoneNumber}
                </td>
                <td className="border px-4 py-2 text-center">
                  {reservation.peopleCount}명
                </td>
                <td className="border px-4 py-2 text-center">
                  {reservation.createdAt
                    ? new Date(reservation.createdAt).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}