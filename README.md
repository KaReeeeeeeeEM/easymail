<div align="center">
  <img src="./public/easymail-wordmark.svg" alt="EasyMail" width="320" />
  <p><strong>A reusable, organization-aware SMTP email API for every application you build.</strong></p>
</div>

EasyMail turns Gmail, Google Workspace, Outlook, or any standards-compliant SMTP account into a stable HTTPS email service. Teams configure and verify senders once, issue rotatable API keys, and send transactional email from any application without rebuilding Nodemailer infrastructure.

## What EasyMail provides

- Multiple encrypted SMTP configurations per workspace
- A default sender or explicit per-request sender selection
- Organization membership, roles, teams, and isolated API keys
- Rotatable, hashed API credentials with configurable rate limits
- SMTP connection verification before credentials are stored
- Idempotent email requests for safe retries
- Accepted and rejected recipient tracking
- Organization-scoped delivery-status lookups
- Email verification and secure password-recovery flows
- Dark mode, responsive dashboard, charts, activity history, and detailed API documentation
- OpenAPI output at `/api/openapi`

## Technology

- Next.js 16 App Router, React 19, TypeScript, and Bun
- Tailwind CSS 4 and shadcn/ui
- Better Auth with organizations, teams, sessions, and API keys
- PostgreSQL and Drizzle ORM
- Nodemailer with dynamic Gmail or custom SMTP transports
- AES-256-GCM encryption for stored SMTP passwords
- Recharts for delivery analytics
- Zod request validation and Vitest unit tests

## How it works

```text
Application
    │ HTTPS + workspace API key
    ▼
POST /api/v1/emails
    │ validates request, key, sender and idempotency
    ▼
Workspace SMTP configuration
    │ decrypts credentials only while sending
    ▼
SMTP provider
    │ accepted / rejected recipients
    ▼
Delivery record + status endpoint
```

`sent` or `accepted` means the SMTP provider accepted at least one recipient. It does not guarantee inbox placement or prove that the recipient opened the message.

## Local development

### Requirements

- Bun 1.3 or newer
- PostgreSQL
- Gmail app-password credentials or another SMTP account for platform authentication emails

### Installation

```bash
git clone https://github.com/KaReeeeeeeeEM/easymail.git
cd easymail
bun install
cp .env.example .env.local
```

Generate secrets:

```bash
openssl rand -base64 32 # BETTER_AUTH_SECRET
openssl rand -hex 32    # APP_ENCRYPTION_KEY
```

Configure `.env.local`, then apply migrations and start development:

```bash
bun run db:migrate
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Better Auth signing secret of at least 32 characters |
| `BETTER_AUTH_URL` | Yes | Canonical application URL |
| `NEXT_PUBLIC_APP_URL` | Yes | Public application URL used in email links |
| `APP_ENCRYPTION_KEY` | Yes | 64-character hexadecimal AES key |
| `PLATFORM_SMTP_USER` | One transport | Gmail address used for account emails |
| `PLATFORM_SMTP_PASSWORD` | One transport | Gmail app password used for account emails |
| `GMAIL_USER` / `GMAIL_PASS` | Alternative | Compatible Gmail aliases |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Alternative | Custom SMTP transport for account emails |

Workspace SMTP credentials are configured by authenticated users from the dashboard and stored separately from platform account-email credentials.

## Sending email

```bash
curl https://easymail.almareem.com/api/v1/emails \
  -H "Authorization: Bearer $EASYMAIL_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: receipt-order-9382" \
  -d '{
    "senderId": "optional-sender-uuid",
    "to": "customer@example.com",
    "subject": "Your receipt",
    "text": "Thanks for your order."
  }'
```

A successful new request returns `201 Created`:

```json
{
  "data": {
    "id": "delivery-uuid",
    "status": "sent",
    "messageId": "<provider-message-id>",
    "accepted": ["customer@example.com"],
    "rejected": [],
    "duplicate": false
  },
  "requestId": "request-uuid"
}
```

Check its latest recorded SMTP status:

```bash
curl https://easymail.almareem.com/api/v1/emails/DELIVERY_ID \
  -H "Authorization: Bearer $EASYMAIL_API_KEY"
```

See `/docs` for JavaScript, Python, cURL, error, rotation, and security examples.

## Authentication lifecycle

1. A user registers with a confirmed password.
2. EasyMail sends a verification link through the platform mail transport.
3. Verified users sign in and create a personal or organization workspace.
4. Workspace administrators add verified SMTP senders.
5. Applications receive separately rotatable API keys.
6. Forgotten-password links expire after 15 minutes, are single-use, and revoke existing sessions after reset.

## Security model

- Better Auth hashes API key secrets and only exposes a complete key once.
- SMTP passwords are encrypted with AES-256-GCM before persistence.
- Sender selection and delivery-status reads are scoped to the API key’s organization.
- Unknown request fields are rejected to prevent From-address spoofing or arbitrary Nodemailer options.
- Payload sizes, recipient counts, timeouts, and API-key rates are bounded.
- Idempotency keys protect retrying applications from duplicate sends.
- Password-reset responses do not disclose whether an account exists.
- Secrets and `.env*` files are excluded from source control.

## Database changes

```bash
bun run db:generate
bun run db:migrate
```

Commit generated migrations and apply them before promoting an incompatible application deployment.

## Quality checks

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```

## Deployment

EasyMail is designed for Vercel. Create a PostgreSQL database, add the production variables listed above, apply migrations to that database, and deploy:

```bash
vercel link
vercel env add DATABASE_URL production
vercel --prod
```

The production domain is `https://easymail.almareem.com`.

## License

Private and proprietary. All rights reserved.
