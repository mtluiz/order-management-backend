FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for bcrypt
RUN apk add --no-cache python3 make g++ 

# Install pnpm
RUN npm install -g pnpm

# Copy all configuration files first
COPY package.json pnpm-lock.yaml tsconfig.json tsconfig.build.json nest-cli.json ./

# Install all dependencies
RUN pnpm install

# Copy source code
COPY . .

# Generate Prisma client properly
RUN pnpm prisma generate

# Build the application
RUN pnpm build

# Check what files were built
RUN find dist -type f | sort

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install build dependencies for bcrypt
RUN apk add --no-cache python3 make g++

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files and config files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --production

# Copy necessary files from builder
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/prisma/ ./prisma/
COPY --from=builder /app/node_modules/.prisma/ ./node_modules/.prisma/

# Verify the build files exist
RUN ls -la dist/

# Rebuild bcrypt for this environment
RUN npm rebuild bcrypt --build-from-source

# Copy entrypoint script and make it executable
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh
# Make sure script has correct line endings
RUN sed -i 's/\r$//' docker-entrypoint.sh 

# Expose API port
EXPOSE 4000

# Use entrypoint script to handle migrations
CMD ["/bin/sh", "./docker-entrypoint.sh"] 