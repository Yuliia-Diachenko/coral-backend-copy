# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

RUN mkdir -p /var/log/app && chown -R node:node /var/log/app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV APP_LOGS_DIR_PATH=/var/log/app
EXPOSE 3000
USER node
CMD ["node","dist/src/main.js"]
