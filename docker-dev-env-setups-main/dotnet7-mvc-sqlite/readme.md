# Overview

This project serves as a template for a Blazor WebAssembly app that uses SQLite as a database 

# Running the app

### **Starting the docker containers**
* in the project root dir, run: `docker-compose up`

### **Serving the app** 
* enter the app shell by executing: `bash scripts/enterAppShell.sh`
* once in the app shell, execute: `dotnet watch run`

### **Accessing the app**
* The front-end can be accessed at: **http://localhost:5000/**

# Development

### **Attaching to the container in VS code**

1. Install the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension in VS code
2. Install the [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) extension in VS code
3. Start the docker containers by running: `docker-compose up` in the project root dir
4. Open the command palette (Ctrl + Shift + P) in VS code and select: `Dev Containers: Attach to Running Container`
5. Select the container with the name: `blazor-sqlite_app_1`