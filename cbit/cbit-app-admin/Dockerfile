# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Set Vite build environment variable to /api to enable proxy-based API communication
ENV VITE_API_URL=/api

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite build output to Nginx default public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (will be mapped to 4102 on host)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
