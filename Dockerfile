FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install --immutable

RUN npm run build

RUN npx prisma generate

EXPOSE ${PORT}

CMD [ "node", "./dist/src/main.js" ]