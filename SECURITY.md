# Security Policy

## Supported Versions
We support the latest version of the `main` branch. Older releases will not receive automatic backported security fixes unless specifically requested.

| Version | Supported          |
| ------- | ------------------ |
| v1.0.x  | :white_check_mark: |
| < v1.0  | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within any AP-Gurukul repository, please do NOT file a public issue. Instead, send an email to the core maintainers at **security@apgurukul.com**.

Please include:
- A detailed description of the vulnerability.
- Steps to reproduce the issue.
- Potential impact on the infrastructure or database.

We will acknowledge receipt of your vulnerability report within 48 hours and strive to provide a fix as quickly as possible.

### Sensitive Data
Do NOT commit any `.env` files, API keys, or Firebase credentials. The architecture strictly isolates the database access via the `backend-api` and Firebase Security Rules.
