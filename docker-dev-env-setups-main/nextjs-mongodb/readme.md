# Overview

This is a template for a nextjs and mongo-db project with separate public and admin apps. The admin app makes use of next-auth for authentication.

NextJs version: v13.4.3

# Running the project

## Prerequisites
* docker and docker-compose
* bash shell

## Steps
1. In the root directory, run `docker-compose up`
2. In a separate terminal, run `bash ./scripts/enterAppShell.sh` to enter the public app shell
3. In the public app shell, run: `npm run dev` to start the public app
4. In another separate terminal, run `bash ./scripts/enterAppShell.sh --a` to enter the admin app shell
5. In the admin app shell, run: `npm run dev` to start the admin app
6. Navigate to **http://localhost:3000** to access the public app
7. Navigate to **http://localhost:3001** to access the admin app

## Managing the database
Mongo express can be accessed by navigating to **http://localhost:8081**. 