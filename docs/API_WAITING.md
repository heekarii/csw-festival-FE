# Waiting API specification

Per product/TF requirements. Adjust `NEXT_PUBLIC_WAITING_PATH` if the server path differs.

## API name

`waiting`

## Method

`POST`

## URL

`{NEXT_PUBLIC_API_BASE_URL}/{NEXT_PUBLIC_WAITING_PATH}`

Default path segment: `waiting` (no leading slash in the env value).

Example: `https://api.example.com/waiting`

## Request headers

| Header | Value |
|--------|--------|
| `Content-Type` | `application/json` |

## Request body (JSON)

| Field | Type | Description |
|-------|------|-------------|
| `phone` | string | Customer contact (e.g. mobile in `010-0000-0000` format; free-form string is allowed if the UI collects email as well). |
| `people` | number | Party size (integer, minimum 1). |
| `partySize` | number | **Sent by this client with the same value as `people`.** Matches the `partySize` field used in the admin waiting list (`WaitingManager` on `feature/add-reservation-management`). |

### Example

```json
{
  "phone": "010-0000-0000",
  "people": 4,
  "partySize": 4
}
```

## Success response

HTTP status: `2xx`

Body (JSON object):

| Field | Type | Description |
|-------|------|-------------|
| `result` | boolean | `true` when the waiting request is accepted; `false` otherwise. |

### Example

```json
{
  "result": true
}
```

## Client behavior (this repository)

- The front end sends `phone`, `people`, and duplicate `partySize` (same as `people`) so payloads align with the admin waiting list model.
- The client treats the call as successful only when the parsed JSON indicates success: object with `result: true`, or legacy raw boolean `true` for backward compatibility.

## Error responses

Non-2xx HTTP status or JSON that does not indicate success is treated as failure in the UI (no waiting registration).
---

## Queue position lookup (optional backend)

Customers can check which position they are in the waiting queue (연번).

### API name

`waiting/position` (default path segment; override with `NEXT_PUBLIC_WAITING_POSITION_PATH`)

### Method

`POST`

### URL

`{NEXT_PUBLIC_API_BASE_URL}/{NEXT_PUBLIC_WAITING_POSITION_PATH}`

Example: `https://api.example.com/waiting/position`

### Request body (JSON)

| Field | Type | Description |
|-------|------|-------------|
| `phone` | string | Same identifier as used when registering the waiting request. |

### Example

```json
{
  "phone": "010-0000-0000"
}
```

### Success response

HTTP status: `2xx`

Body must include a positive integer `queueNumber` (1-based waiting order).

| Field | Type | Description |
|-------|------|-------------|
| `queueNumber` | number | Current position in the queue (e.g. 5 = fifth in line). |
| `waitingNumber` | number | **Alias:** same meaning as `queueNumber`; accepted for compatibility with list rows that use `waitingNumber`. |
| `result` | boolean | Optional; if present and `false`, treat as lookup failure. |

### Example

```json
{
  "result": true,
  "queueNumber": 5
}
```

### Client behavior

- On success, the UI shows: "현재 웨이팅 N번째 순서입니다."
- If `result` is `false` or neither `queueNumber` nor `waitingNumber` is a valid positive integer, the UI shows a not-found style message.

---

## Cross-branch compatibility (same monorepo)

| Area | Branch / route | Expectation |
|------|------------------|-------------|
| Customer waiting submit | `feature/waiting-pr` → `POST …/waiting` | Body includes `phone`, `people`, and `partySize` (duplicate) so the same backend can populate admin lists. |
| Admin waiting list | `feature/add-reservation-management` → `GET …/waiting` | JSON array items use `id`, `phone`, `partySize`, and display `waitingNumber` (derived in UI). |
| Admin enter | same branch → `POST …/waiting/:id/enter` | Unrelated to customer submit; no change here. |
| Reservations admin | `GET …/reservations` | Uses `phoneNumber`, `peopleCount`, `visitTime` — **different resource** from waiting; customer waiting flow does not send `visitTime`. Align only if the product merges those APIs. |
| Tables (seats) | `GET …/tables` | Independent of waiting customer payload. |
