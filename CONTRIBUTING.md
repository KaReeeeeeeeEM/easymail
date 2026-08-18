# Contributing to EasyMail

Thank you for helping improve EasyMail. Contributions through bug reports,
documentation updates, tests, design improvements, and focused code changes are
welcome.

## Before you begin

- Search the existing issues and pull requests before opening a duplicate.
- For a large feature or architectural change, open an issue first so the
  approach can be discussed.
- Never include API keys, SMTP credentials, database URLs, personal data, or
  other secrets in an issue, commit, screenshot, test fixture, or pull request.
- Keep each pull request focused on one concern.

## Development setup

1. Fork [`KaReeeeeeeeEM/easymail`](https://github.com/KaReeeeeeeeEM/easymail).
2. Clone your fork and enter the project:

   ```bash
   git clone https://github.com/YOUR_USERNAME/easymail.git
   cd easymail
   ```

3. Install dependencies and create a local environment file:

   ```bash
   bun install
   cp .env.example .env.local
   ```

4. Configure a local PostgreSQL database. Do not use the production database.
5. Apply migrations and start the application:

   ```bash
   bun run db:migrate
   bun run dev
   ```

## Create a branch

Create your branch from the latest `main`:

```bash
git checkout main
git pull upstream main
git checkout -b feature/short-description
```

Use a clear prefix such as `feature/`, `fix/`, `docs/`, or `test/`.

## Project expectations

- Follow the existing TypeScript, Next.js App Router, and shadcn/ui patterns.
- Use semantic theme tokens and existing UI components.
- Keep database access and secrets on the server.
- Preserve organization isolation for senders, API keys, and deliveries.
- Add or update tests for behavior changes.
- Update documentation when an API or user workflow changes.
- Include migrations for database schema changes.

## Validate your change

Run all checks before opening a pull request:

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```

For interface changes, test light and dark themes, keyboard navigation, mobile
layout, loading states, empty states, and error feedback.

## Open a pull request

1. Push your branch to your fork.
2. Open a pull request with `KaReeeeeeeeEM/easymail:main` as the base branch.
3. Explain the problem, the solution, verification performed, and any database
   or environment changes.
4. Add screenshots or a short recording for visible interface changes.
5. Respond to review feedback with follow-up commits.

Maintainers may request changes, squash commits, or close contributions that do
not match the project scope, security requirements, or code quality standards.

## Reporting security issues

Do not disclose vulnerabilities publicly. Use GitHub private vulnerability
reporting from the repository Security tab. Include reproducible steps and the
potential impact without including real credentials or user data.

## License

By contributing, you agree that your contribution is licensed under the
[MIT License](./LICENSE).
