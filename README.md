# bbc
BBC website with a Next.js frontend, FastAPI backend, and CDK infra.

## Prereqs
- Node.js 20.9+ (Next.js build requires >=20.9)
- Docker (for the backend container)
- AWS credentials if you plan to run the backend against DynamoDB

## Install
Run from repo root:
```
npm install
```
This installs root deps plus `frontend/` and `infra/` packages.

## Frontend dev
Set the API base URL (example):
```
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > frontend/.env.local
```
Run the frontend dev server:
```
npm run dev
```

## Backend (Docker)
See `backend/README.md` for full instructions. Quick start:
```
docker build -t fastapi-local -f backend/Dockerfile.dev backend
docker run \
  -p 8000:8000 \
  -v ~/.aws:/root/.aws:ro \
  -e AWS_PROFILE=default \
  -e AWS_DEFAULT_REGION=us-east-1 \
  -e APP_ENV=dev \
  -e BBC_TABLE_PROD=bbc_prod \
  -e BBC_TABLE_DEV=bbc_dev \
  fastapi-local
```

## Full stack (script)
```
./run_local.sh
```
Note: this script assumes `nvm` and uses `xdg-open` (Linux). On macOS,
replace with `open` or remove that line.

## Git hooks (Lefthook)
This repo uses a Lefthook pre-commit hook to run `./build.sh` on commit.

Setup:
```
npm install
npx lefthook install
```

## Notes
- New DynamoDB tables must be added in CDK and deployed with `cdk deploy` to create them in AWS.
- New API routes are implemented in FastAPI (`backend/main.py`).
