import type { Metadata } from "next";
import Link from "next/link";
import WaitingManager, { Waiting } from "../../components/WaitingManager";

export const metadata: Metadata = {
  title: "웨이팅 목록 관리 페이지",
  description: "현자카야 웨이팅 목록 관리 페이지",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchWaitingList(): Promise<Waiting[]> {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.");
  }

  const res = await fetch(`${API_BASE}/waiting`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("웨이팅 목록을 불러오지 못했습니다.");
  }

  const data: Waiting[] = await res.json();

  return data.map((waiting, index) => ({
    ...waiting,
    waitingNumber: index + 1,
  }));
}

export default async function WaitingManagePage() {
  const initialWaitingList = await fetchWaitingList();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/"
              className="font-medium text-blue-600 hover:underline"
            >
              테이블 입장 관리
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/waiting"
              className="font-medium text-blue-600 hover:underline"
            >
              고객 웨이팅 화면
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">현자카야</p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            웨이팅 목록 관리
          </h1>

          <p className="mt-2 text-gray-500">
            축제 주점의 웨이팅 예약자를 확인하고 입장 처리를 할 수 있습니다.
          </p>
        </div>

        <WaitingManager initialWaitingList={initialWaitingList} />
      </div>
    </main>
  );
}
