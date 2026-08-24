# Bubatronik Emergencias — Integration Foundation

Reusable foundation for weather and emergency events across WorldMOS, T&O, Fluviaria and future projects.

## Principles

- One canonical event: alert + local signal + PING.
- Server-side validation before delivery.
- Idempotency by `event_id` and `dedupe_key`.
- No secrets in the repository.
- Human-readable status plus machine-readable fields.

## Event lifecycle

`received` → `validated` → `active` → `resolved` or `expired`.

Rejected input must never be dispatched. A client should treat `source` data as untrusted until validated by the API.

## Vercel endpoint

`POST /api/emergency-event`

The endpoint accepts a JSON event, validates and normalizes it, and returns:

```json
{
  "ok": true,
  "duplicate": false,
  "event": {}
}
```

Required headers:

- `content-type: application/json`
- Optional `x-idempotency-key` for upstream retry control.

The demo endpoint does not send external notifications. Connect a real adapter only after validating the event and applying project-level authorization, rate limits and user consent.

## Canonical fields

- `event_id`: stable unique identifier.
- `occurred_at`: ISO-8601 timestamp.
- `project`: consumer project, e.g. `emergencias`, `to`, `fluviaria` or `worldmos-radio`.
- `location`: latitude, longitude and human-readable zone.
- `phenomenon`: `lluvia`, `tormenta`, `viento`, `nieve`, `calor`, `inundacion` or `otro`.
- `severity`: integer from 0 to 5. It is an application severity, not an official warning replacement.
- `source`: provider name and optional source event ID.
- `delivery`: channel and delivery status.
- `status`: `active`, `resolved`, `expired` or `rejected`.

## Safety and operations

- Keep API keys, webhook URLs and bot tokens in Vercel environment variables.
- Do not present this demo as an official emergency warning service.
- Display source, timestamp and freshness to operators.
- Add monitoring for validation failures, duplicate events and delivery failures.
- Use official providers and local authorities for production alerting.

## Local checks

```bash
npm test
node --check src/emergency-event.js
```

## Extension points

Adapters can map the canonical event to web push, Telegram, radio overlays, dashboards or Supabase. Keep adapters outside the validator so a delivery failure cannot alter the canonical event.