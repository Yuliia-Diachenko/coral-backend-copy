# Coral - Admin Panel

## Getting started

<!-- Create Docker container -->

docker build -t coral-backend:local .

<!-- Run Docker container -->

docker run -d -p 127.0.0.1:5000:3000 --network coral-network --restart always --name coral-backend -v logs:/var/log/app/:rw --env-file .env coral-backend:local

<!-- Working widt DB -->

npx prisma migrate dev --name init
npx prisma generate
npx node prisma/seed.ts

<!-- prisma -->

npx prisma studio

<!-- Logs -->

https://coralscript.com/api/log-access/logs/download/application-2025-09-15.log
