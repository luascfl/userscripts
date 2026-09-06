---
type: doc
name: tooling
description: Scripts, IDE settings, automation, and developer productivity tips
category: tooling
generated: 2026-09-06
status: unfilled
scaffoldVersion: "2.0.0"
---
## Tooling & Productivity Guide

This guide covers the tools, scripts, and configurations that make development efficient.

Following these setup recommendations ensures a consistent development experience across the team.

## Required Tooling

**Runtime**:
- Node.js (v18+ recommended)
- npm / yarn / pnpm

**Version Management** (recommended):
- [nvm](https://github.com/nvm-sh/nvm) for Node.js version management
- `.nvmrc` file specifies project Node version

**Installation**:
```bash
# Using nvm (recommended)
nvm install
nvm use

# Install dependencies
npm install
```

## Recommended Automation

**Pre-commit Hooks**:
The project uses [husky](https://typicode.github.io/husky/) for git hooks:
- Pre-commit: Runs linting and type checking
- Commit message: Validates commit message format

**Code Quality Commands**:
```bash
npm run lint          # Check code style
npm run lint:fix      # Auto-fix style issues
npm run format        # Format code with Prettier
npm run typecheck     # TypeScript type checking
```

**Watch Mode**:
```bash
npm run dev           # Development with hot reload
npm run test:watch    # Tests in watch mode
```

## IDE / Editor Setup

**VS Code Recommended Extensions**:
- ESLint — Inline linting
- Prettier — Code formatting
- TypeScript + JavaScript Language Features — IntelliSense
- Error Lens — Inline error highlighting

**Workspace Settings**:
The `.vscode/` folder contains shared settings:
- `settings.json` — Editor configuration
- `extensions.json` — Recommended extensions
- `launch.json` — Debug configurations

## Productivity Tips

**Useful Aliases**:
```bash
alias nr='npm run'
alias nrd='npm run dev'
alias nrt='npm run test'
```

**Quick Commands**:
- `npm run build && npm run test` — Full verification before PR
- `npm run clean` — Clear build artifacts and caches

## Related Resources

<!-- Link to related documents for cross-navigation. -->

- [development-workflow.md](./development-workflow.md)
