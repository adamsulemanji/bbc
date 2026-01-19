#!/bin/bash

# Store the project root directory
PROJECT_ROOT="$(pwd)"


# Function to clean up processes on exit
cleanup() {
    echo "Shutting down services..."
    
    # Stop any running docker containers from the API
    cd "$PROJECT_ROOT/api"
    docker stop $(docker ps -q --filter ancestor=fastapi-local) 2>/dev/null
    
    # Kill the frontend process
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    echo "Services shut down."
    exit 0
}

# Set up the trap for clean shutdown
trap cleanup INT TERM

echo "Starting services..."

echo "Validating and Updating nvm version..."
nvm use

# Start the API service
echo "Building and running backend container..."
cd "$PROJECT_ROOT/backend"
docker build -t fastapi-local -f Dockerfile.dev .

echo "Running API container..."
# Run docker in detached mode with -d flag
docker run -d \
  -p 8000:8000 \
  -v ~/.aws:/root/.aws:ro \
  -e AWS_PROFILE=default \
  -e AWS_DEFAULT_REGION=us-east-1 \
  -e APP_ENV=dev \
  -e BBC_TABLE_PROD=bbc_prod \
  -e BBC_TABLE_DEV=bbc_dev \
  fastapi-local


# Open up localhost:3000 in the default browser
echo "Opening frontend in the default browser..."
xdg-open http://localhost:3000 2>/dev/null

# Start the frontend service
echo "Starting frontend development server..."
cd "$PROJECT_ROOT/frontend"
npm run dev & FRONTEND_PID=$!

echo "Both services are running!"
echo "API is running in Docker container"
echo "Frontend development server is running with PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop all services."


# Keep the script running
wait $FRONTEND_PID
