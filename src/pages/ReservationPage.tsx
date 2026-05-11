import type { FormEvent } from "react";
import { useState } from "react";
import { submitReservation } from "../api/reservation.ts";
import "./ReservationPage.css";

export function ReservationPage() {
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
      const ok = await submitReservation({
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
    <main className="reservation">
      <div className="reservation__card">
        <h1 className="reservation__title">현자카야 웨이팅</h1>
        <p className="reservation__lead">
          연락처와 인원을 입력해 웨이팅을 요청합니다.
        </p>
        <p className="reservation__note">
          연번은 웨이팅에서 몇 번째 순서인지를 나타내는 번호입니다. 순번은
          접수 후 매장에서 안내됩니다.
        </p>

        <form className="reservation__form" onSubmit={handleSubmit} noValidate>
          <label className="reservation__field">
            <span className="reservation__label">연락처</span>
            <input
              type="text"
              name="contact"
              autoComplete="tel"
              inputMode="tel"
              placeholder="전화번호 또는 이메일"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              disabled={submitting}
              required
            />
          </label>

          <label className="reservation__field">
            <span className="reservation__label">인원수</span>
            <input
              type="number"
              name="participantCount"
              min={1}
              step={1}
              placeholder="명"
              value={participantCount}
              onChange={(e) => setParticipantCount(e.target.value)}
              disabled={submitting}
              required
            />
          </label>

          {errorMessage ? (
            <p className="reservation__hint reservation__hint--error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {result === "success" ? (
            <p className="reservation__hint reservation__hint--success" role="status">
              웨이팅 요청이 접수되었습니다.
            </p>
          ) : null}

          {result === "failure" && !errorMessage ? (
            <p className="reservation__hint reservation__hint--error" role="alert">
              웨이팅 처리에 실패했습니다. 입력 정보를 확인하거나 다시 시도해 주세요.
            </p>
          ) : null}

          <button
            type="submit"
            className="reservation__submit"
            disabled={submitting}
          >
            {submitting ? "전송 중…" : "웨이팅 요청"}
          </button>
        </form>
      </div>
    </main>
  );
}