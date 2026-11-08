FROM node:24-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --force
COPY . .
# Coolify injects build-time envs as build args (NEXT_PUBLIC_*), nothing secret is needed at build.
RUN npm run build
ENV NODE_ENV=production PORT=80 HOSTNAME=0.0.0.0
EXPOSE 80
# start = prisma migrate deploy && next start
CMD ["npm", "start"]
