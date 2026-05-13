"use client";

import { useState } from "react";

export type Waiting = {
  id: number;
  waitingNumber: number;
  phone: string;
  partySize: number;
};

type WaitingManagerProps = {
  initialWaitingList: Waiting[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function WaitingManager({
  initialWaitingList,
}: WaitingManagerProps) {
  const [waitingList, setWaitingList] =
    useState<Waiting[]>(initialWaitingList);

  const [isLoadingId, setIsLoadingId] = useState<number | null>(null);

  const handleEnter = async (id: number) => {
    const isConfirmed = window.confirm("해당 웨이팅을 입장 처리할까요?");

    if (!isConfirmed) return;

    if (!API_BASE) {
      alert("API 주소가 설정되지 않았습니다.");
      return;
    }

    try {
      setIsLoadingId(id);

      const res = await fetch(`${API_BASE}/waiting/${id}/enter`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("입장 처리에 실패했습니다.");
      }

      setWaitingList((prev) =>
        prev
          .filter((waiting) => waiting.id !== id)
          .map((waiting, index) => ({
            ...waiting,
            waitingNumber: index + 1,
          }))
      );
    } catch (error) {
      console.error(error);
      alert("입장 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoadingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">현재 대기 팀</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {waitingList.length}
            <span className="ml-1 text-lg font-medium text-gray-500">팀</span>
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">웨이팅 목록</h2>
          <p className="mt-1 text-sm text-gray-500">
            입장 완료된 웨이팅은 목록에서 제거됩니다.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-semibold">대기번호</th>
                <th className="px-6 py-4 font-semibold">연락처</th>
                <th className="px-6 py-4 font-semibold">인원 수</th>
                <th className="px-6 py-4 text-center font-semibold">관리</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {waitingList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                        ✓
                      </div>
                      <p className="text-lg font-semibold text-gray-800">
                        현재 대기 중인 웨이팅이 없습니다.
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        새로운 웨이팅이 등록되면 이곳에 표시됩니다.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                waitingList.map((waiting) => (
                  <tr key={waiting.id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {waiting.waitingNumber}번
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {waiting.phone}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {waiting.partySize}
                      </span>
                      <span className="ml-1 text-gray-500">명</span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEnter(waiting.id)}
                        disabled={isLoadingId === waiting.id}
                        className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        {isLoadingId === waiting.id
                          ? "처리 중..."
                          : "입장 처리"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}