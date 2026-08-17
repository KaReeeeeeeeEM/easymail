# Uploads
## Purpose
Handle user-supplied files safely, reliably, and accessibly.
## Philosophy
Treat every file as hostile. Store bytes outside application servers and grant the least access for the shortest time.
## Best Practices
- Use signed direct uploads, randomized object keys, multipart/resumable transfer for large files.
- Validate declared and detected type, extension, size, count, and dimensions; scan before use.
- Process asynchronously in quarantine and publish only clean derivatives.
## Rules
- Never execute uploads or serve active content from the application origin.
- Authorization applies to upload initiation, object access, replacement, and deletion.
- Strip unsafe metadata and prevent path traversal/overwrite.
## Examples
```text
request signed URL → upload quarantine → verify/scan → transform → publish → expire original per policy
```
## Anti-patterns
Trusting MIME headers, public buckets, original filenames as keys, synchronous image processing.
## Checklist
- [ ] Size/type/content and malware controls exist.
- [ ] Storage/access/lifecycle are private and scoped.
- [ ] Progress, retry, cancellation, and cleanup work.

Related: `security.md`, `backend.md`, `monitoring.md`.
