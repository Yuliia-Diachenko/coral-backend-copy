FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install --immutable

RUN npm run build

RUN npx prisma migrate dev --name init
RUN npx prisma generate
RUN npx node prisma/seed.ts

EXPOSE ${PORT}

CMD [ "node", "./dist/src/main.js" ]