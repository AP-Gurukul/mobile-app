# Contributing to AP-Gurukul

Thank you for your interest in contributing to AP-Gurukul! 

## 🌍 The Universal Architecture (Firebase Sync)
Before you contribute, please understand our core architecture:
**Everything is synced.** Whether a user is logging into the `web-app`, the `mobile-app`, or the `telegram-web-app`, they are authenticating with the exact same Google Gmail account. 
When an admin adds a new question in the `admin-portal`, that single Firestore database updates in real-time, instantly pushing the new question out to the mobile app, web app, and telegram app simultaneously.

There is only **one** source of truth: our Firebase database. 

## 🛠 Contribution Workflows

1. **Fork** the repository to your personal GitHub account.
2. Create a new branch: `git checkout -b feat/your-feature`.
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/).
4. Push changes to your fork and open a **Pull Request** to our `main` branch.
*(Note: As an open-source contributor, you test against our public staging APIs).*

## 📜 Code Style
- **TypeScript**: We strictly use TypeScript across all repositories.
- **ESLint/Prettier**: Run `npm run lint` before committing.

Thank you for helping us build the ultimate educational platform!
