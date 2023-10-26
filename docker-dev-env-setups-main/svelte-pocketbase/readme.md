# Overview

This project serves as a template for a typescript svelte application that uses pocketbase as a back-end. The front-end is an SPA that includes the use of svelte-spa-router for routing and the pocketbase sdk to connect to the back-end. 

# Running the app

### **Starting the docker containers**
* in the project root dir, run: `docker-compose up`

### **Serving the front-end** 
* to serve the front-end, enter the app shell by executing: `bash scripts/enterAppShell.sh`
* once in the app shell, execute: `npm run dev -- --host`

### **Accessing the app**
* The pocketbase admin page can be accessed at: **http://0.0.0.0:8090/**
* The front-end can be accessed at: **http://localhost:5173/**