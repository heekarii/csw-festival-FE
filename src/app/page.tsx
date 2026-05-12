import Link from "next/link";
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
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">테이블 입장 관리</h1>
        <Link
          href="/waiting"
          className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          고객 웨이팅
        </Link>
      </div>
      <TableTimer initialTables={initialTables} />
    </div>
  );
}