# Coral - Admin Panel

## Getting started

<!-- Create Docker container -->

docker build -t coral-backend .

<!-- Run Docker container -->

docker run --env-file .env -p 5000:5000 coral-backend

docker run -d -p 127.0.0.1:5000:3000 --network coral-network --restart always --name coral3 -v logs:/var/log/app/:rw --env-file .env coral3:local
docker run -d -p 127.0.0.1:5000:3000 --network coral-network --restart always --name coral3 -v logs:/var/log/app/:rw --env-file .env coral3:local

<!-- Working widt DB -->

npx prisma migrate dev --name init
npx prisma generate
npx node prisma/seed.ts

<!-- prisma -->

npx prisma studio

<!-- Logs -->

https://coralscript.com/api/log-access/logs/download/application-2025-09-11.log
