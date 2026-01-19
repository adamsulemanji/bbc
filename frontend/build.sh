#!/bin/bash

# print all the .env.production variables
if [ -f ".env.production" ]; then
    cat .env.production
else
    echo ".env.production not found; using environment variables."
fi

if [ -n "$NVM_DIR" ] && [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
fi

if command -v nvm >/dev/null 2>&1; then
    nvm use
fi

# Load the .env.production variables
if [ -f ".env.production" ]; then
    set -a
    . ./.env.production
    set +a
fi


# Run the Next.js build command directly to avoid recursion
npx next build
