"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { submitWaiting } from "@/lib/api/waiting";

export default function WaitingForm() {
  const [contact, setContact] = useState("");
  const [participantCount, setParticipantCount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "failure">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setResult("idle");

    const trimmed = contact.trim();
    const count = Number.parseInt(participantCount, 10);

    if (!trimmed) {
      setErrorMessage("연락처를 입력해 주세요.");
      return;
    }
    if (!Number.isFinite(count) || count < 1) {
      setErrorMessage("인원수는 1명 이상의 숫자로 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const ok = await submitWaiting({
        contact: trimmed,
        participantCount: count,
      });
      setResult(ok ? "success" : "failure");
      if (ok) {
        setContact("");
        setParticipantCount("");
      }
    } catch {
      setResult("failure");
      setErrorMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <div className="mb-4 flex justify-end">
        <Link
          href="/"
          className="text-sm font-medium text-sky-700 underline-offset-2 hover:underline"
        >
          테이블 입장 관리
        </Link>
      </div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
        현자카야 웨이팅
      </h1>
      <p className="mb-6 text-sm text-slate-600">
        연락처와 인원을 입력해 웨이팅을 요청합니다.
      </p>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-slate-700">연락처</span>
          <input
            type="text"
            name="contact"
            autoComplete="tel"
            inputMode="tel"
            placeholder="전화번호 또는 이메일"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            disabled={submitting}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none ring-sky-500/30 transition focus:border-sky-600 focus:ring-4 disabled:opacity-60"
            required
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-slate-700">인원수</span>
          <input
            type="number"
            name="participantCount"
            min={1}
            step={1}
            placeholder="명"
            value={participantCount}
            onChange={(e) => setParticipantCount(e.target.value)}
            disabled={submitting}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none ring-sky-500/30 transition focus:border-sky-600 focus:ring-4 disabled:opacity-60"
            required
          />
        </label>

        {errorMessage ? (
          <p className="text-sm text-red-700" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {result === "success" ? (
          <p className="text-sm text-emerald-700" role="status">
            웨이팅 요청이 접수되었습니다.
          </p>
        ) : null}

        {result === "failure" && !errorMessage ? (
          <p className="text-sm text-red-700" role="alert">
            웨이팅 처리에 실패했습니다. 입력 정보를 확인하거나 다시 시도해 주세요.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 rounded-lg bg-sky-600 py-3 text-base font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "전송 중…" : "웨이팅 요청"}
        </button>
      </form>
    </div>
  );
}