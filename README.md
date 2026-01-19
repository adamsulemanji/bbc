# bbc
bbc website

## Install
Run from repo root:
```
npm install
```
This installs root deps plus `frontend/` and `infra/` packages.

## Dev
Run the frontend dev server:
```
npm run dev
```

## Git hooks (Lefthook)
This repo uses a Lefthook pre-commit hook to run `./build.sh` on commit.

Setup:
```
npm install
npx lefthook install
```
