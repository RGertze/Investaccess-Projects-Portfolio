FROM ubuntu:20.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    zip \
    vim \
    unzip \
    git \
    curl \
    && apt-get clean

# Create directories
RUN mkdir /pocketbase /Downloads

# download pocketbase and place in /Downloads
RUN curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.16.2/pocketbase_0.16.2_linux_amd64.zip -o /Downloads/pocketbase.zip 

# unzip pocketbase and place in /pocketbase
RUN unzip /Downloads/pocketbase.zip -d /pocketbase

# serve pocketbase at 0.0.0.0:8090
CMD ["/pocketbase/pocketbase", "serve", "--http", "0.0.0.0:8090"]
