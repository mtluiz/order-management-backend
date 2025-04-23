#!/bin/sh
set -e

echo "🔄 Ensuring native modules are correctly built..."
npm rebuild bcrypt --build-from-source

echo "🔄 Waiting for database to be ready..."
# Simple wait script to ensure database is ready
MAX_RETRIES=60
RETRY_INTERVAL=3
COUNTER=0

# First, regenerate Prisma client to ensure it's correctly available
echo "📝 Generating Prisma client..."
pnpm prisma generate

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL environment variable is not set"
  exit 1
else
  echo "✅ Using DATABASE_URL: $DATABASE_URL"
fi

echo "⏱️ Waiting for database to be ready before attempting migrations..."
sleep 10

# Try to run migrations with retries
until pnpm prisma migrate deploy || [ $COUNTER -eq $MAX_RETRIES ]; do
  echo "⏳ Waiting for database connection... (attempt $COUNTER/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
  COUNTER=$((COUNTER+1))
done

if [ $COUNTER -eq $MAX_RETRIES ]; then
  echo "❌ Failed to connect to database after $MAX_RETRIES attempts"
  exit 1
fi

echo "✅ Database migrations applied successfully"

echo "🚀 Starting application"
# Try different ways to start the app
if command -v nest >/dev/null 2>&1; then
  echo "Using NestJS CLI"
  exec nest start --watch
elif [ -f ./dist/main.js ]; then
  echo "Using Node directly"
  exec node dist/main.js
else
  echo "Using NPX to run NestJS"
  exec npx nest start --watch
fi 