"use client";

import { useState, useEffect } from "react";

export type Table = {
  id: number;
  name: string;
  entryTime: string | null;
};

type Props = {
  initialTables: Table[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function TableTimer({ initialTables }: Props) {
  // ① 서버에서 받아온 초기 상태
  const [tables, setTables] = useState<Table[]>(initialTables);

  useEffect(() => {
    setTables(initialTables);
  }, [initialTables]);

  // ② 실시간 시계
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ③ API 호출 후 상태 업데이트
  const handleEnter = async (id: number) => {
    await fetch(`${API_BASE}/tables/${id}/enter`, {
      method: "POST",
    });
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, entryTime: new Date().toISOString() }
          : t
      )
    );
  };

  const handleReset = async (id: number) => {
    await fetch(`${API_BASE}/tables/${id}/reset`, {
      method: "POST",
    });
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, entryTime: null } : t))
    );
  };

  const formatElapsed = (start: Date) => {
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return [h, m, s]
      .map((v) => v.toString().padStart(2, "0"))
      .join(":");
  };

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">테이블 목록</h2>
        <p className="mt-1 text-sm text-gray-500">
          입장 처리 후 테이블별 이용 시간을 실시간으로 확인할 수 있습니다.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-sm text-gray-500">
              <th className="px-6 py-4 font-semibold">테이블</th>
              <th className="px-6 py-4 font-semibold">입장 시간</th>
              <th className="px-6 py-4 font-semibold">경과 시간</th>
              <th className="px-6 py-4 text-center font-semibold">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tables.map((t) => {
              const entered = !!t.entryTime;
              const start = entered ? new Date(t.entryTime!) : null;
              return (
                <tr key={t.id} className="transition hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {t.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {entered ? start!.toLocaleTimeString() : "-"}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-900">
                    {entered && start ? formatElapsed(start) : "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {entered ? (
                      <button
                        className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-95"
                        onClick={() => handleReset(t.id)}
                      >
                        리셋
                      </button>
                    ) : (
                      <button
                        className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700 active:scale-95"
                        onClick={() => handleEnter(t.id)}
                      >
                        입장
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
