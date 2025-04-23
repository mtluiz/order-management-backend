FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies for bcrypt
RUN apk add --no-cache python3 make g++ 

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies, including native modules
RUN pnpm install

# Copy source code
COPY . .

# Generate Prisma client properly
RUN pnpm prisma generate

# Build the application
RUN pnpm build

# Production stage - Using the SAME Node.js version
FROM node:18-alpine

WORKDIR /app

# Install build dependencies for bcrypt
RUN apk add --no-cache python3 make g++

# Install pnpm and NestJS CLI globally
RUN npm install -g pnpm @nestjs/cli

# Copy package files first (for clean install)
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copy TypeScript configuration files
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tsconfig.build.json ./
COPY --from=builder /app/nest-cli.json ./

# Rebuild bcrypt for this environment
RUN npm rebuild bcrypt --build-from-source

# Add node_modules/.bin to PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copy entrypoint script and make it executable 
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh
# Make sure script has correct line endings
RUN sed -i 's/\r$//' docker-entrypoint.sh 

# Expose API port
EXPOSE 4000

# Use entrypoint script to handle migrations
CMD ["/bin/sh", "./docker-entrypoint.sh"] 