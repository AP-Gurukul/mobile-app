# Contributing to AP-Gurukul

Thank you for your interest in contributing to AP-Gurukul! 

## 🌍 The Universal Architecture (Firebase Sync)
Before you contribute, please understand our core architecture:
**Everything is synced.** Whether a user is logging into the `web-app`, the `mobile-app`, or the `telegram-web-app`, they are authenticating with the exact same Google Gmail account. 
When an admin adds a new question in the `admin-portal`, that single Firestore database updates in real-time, instantly pushing the new question out to the mobile app, web app, and telegram app simultaneously.

There is only **one** source of truth: our Firebase database. 

## 🛠 Contribution Workflows

Because AP-Gurukul operates a hybrid open-source model, the workflow depends on your role.

### Open-Source Contributors (Public Repositories)
*Applies to: `web-app`, `mobile-app`, `telegram-web-app`, `shared-ui`*
1. **Fork** the repository to your personal GitHub account.
2. Create a new branch: `git checkout -b feat/your-feature`.
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/).
4. Push changes to your fork and open a **Pull Request** to our `main` branch.
*(Note: As an open-source contributor, you test against our public staging APIs. You will not have access to the backend code).*

### Internal Private Team (Backend & Admin)
*Applies to: `backend-api`, `admin-portal`, `infrastructure`, `firebase-functions`*
1. Clone the repository directly.
2. Run `docker compose up -d` in the `infrastructure` repo to spin up the local database and backend.
3. Create a branch locally (`feat/internal-feature`).
4. Open an internal Pull Request for review by a `@core-maintainer`.

## 📜 Code Style
- **TypeScript**: We strictly use TypeScript across all repositories.
- **ESLint/Prettier**: Run `npm run lint` before committing.
- **Components**: Use our `@ap-gurukul/shared-ui` package instead of writing duplicate UI code.

Thank you for helping us build the ultimate educational platform!
