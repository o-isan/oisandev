# ========================
# Base
# ========================
FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ========================
# Development
# ========================
FROM base AS dev
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ========================
# Build
# ========================
FROM base AS build
RUN npm run build

# ========================
# Production
# ========================
FROM node:20-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.mjs ./

EXPOSE 3000
CMD ["npm", "run", "start"]