# Coral - Admin Panel



## Getting started

<!-- Create Docker container -->
docker build -t coral-backend .

<!-- Run Docker container -->
docker run --env-file .env -p 5000:5000 coral-backend
