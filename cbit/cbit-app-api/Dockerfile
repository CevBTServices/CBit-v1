# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files, Prisma config and schema
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install all dependencies (needed for compiling TypeScript and generating Prisma client)
# Prisma config requires DATABASE_URL to be set, but generate doesn't actually connect to the DB
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npm ci

# Copy source code and config
COPY tsconfig.json ./
COPY src ./src/

# Re-generate Prisma Client to ensure types match source code
RUN npx prisma generate

# Compile TypeScript
RUN npm run build:prod

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy built application and generated Prisma client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/src/generated ./dist/generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Ensure uploads directory exists
RUN mkdir -p /app/uploads

# Expose backend port
EXPOSE 2000

CMD ["sh", "-c", "npx prisma db push && node dist/app.js"]

