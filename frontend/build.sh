#!/bin/bash

# print all the .env.production variables
cat .env.production

if [ -n "$NVM_DIR" ] && [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
fi

if command -v nvm >/dev/null 2>&1; then
    nvm use
fi

# Load the .env.production variables
export $(cat .env.production | xargs)


# Run the Next.js build command directly to avoid recursion
npx next build
