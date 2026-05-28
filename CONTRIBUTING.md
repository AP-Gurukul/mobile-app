# Contributing to APPSC Pandit

First off, thank you for considering contributing to APPSC Pandit! It's people like you that make this application better for all students.

## Branching Strategy

- **DO NOT push directly to the `main` branch.**
- Always create a new branch for every feature or bug fix.
- Branch naming convention: `feature/description-of-feature`, `bugfix/description-of-bug`, `hotfix/description`.

## Pull Requests (PRs)

- When you are ready to merge your code, open a Pull Request against the `main` branch.
- **Detailed PR Descriptions:** Every PR must include a very detailed description of what was changed, why it was changed, and how it was tested.
- Review process: Wait for a code review before merging. Do not merge your own PRs.

## Commit Messages

- **Detailed Commits:** Write detailed and meaningful commit messages.
- Format: Try to follow conventional commits (e.g., `feat: added practice engine`, `fix: corrected login validation error`).

## Development Guidelines

1. **Keep it modular:** Place reusable components in `src/components/`.
2. **State Management:** Use Zustand in `src/store/` for global state. Do not overuse React Context unless necessary.
3. **Styling:** We use React Native Paper for UI. Stick to the theme variables provided in `src/theme/theme.ts` instead of hardcoding colors.
4. **Testing:** Make sure to test your code locally on both iOS and Android platforms before opening a PR.

## Setup Instructions

Please refer to the [README.md](README.md) for local environment setup instructions.
