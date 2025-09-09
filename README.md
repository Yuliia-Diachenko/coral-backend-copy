# Coral - Admin Panel



## Getting started

<!-- Create Docker container -->
docker build -t coral-backend .

<!-- Run Docker container -->
docker run --env-file .env -p 5000:5000 coral-backend



<!-- Working widt DB -->
npx prisma migrate dev --name init
npx prisma generate
npx node prisma/seed.ts

<!-- prisma -->
npx prisma studio

<!-- Logs -->
https://coralscript.com/api/var/log/app/errors/download/error-2025-09-08.log
