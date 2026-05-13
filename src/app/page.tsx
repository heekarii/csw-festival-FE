import Link from "next/link";
import AutoRefresh from "./components/AutoRefresh";
import TableTimer, { Table } from "./components/TableTimer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchTables(): Promise<Table[]> {
  const url = `${API_BASE}/tables`;
  const res = await fetch(url, {
    cache: "no-store",
  });
  return res.json();
}

export default async function Page() {
  const initialTables = await fetchTables();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900">
      <AutoRefresh />
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/waiting/manage"
              className="font-medium text-blue-600 hover:underline"
            >
              웨이팅 목록 관리
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

        <header className="mb-8">
          <p className="text-sm font-semibold text-blue-600">현자카야</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            테이블 입장 관리
          </h1>
          <p className="mt-2 text-gray-500">
            축제 주점의 테이블별 입장 시간과 이용 경과 시간을 확인하고
            관리할 수 있습니다.
          </p>
        </header>

        <TableTimer initialTables={initialTables} />
      </div>
    </main>
  );
}
