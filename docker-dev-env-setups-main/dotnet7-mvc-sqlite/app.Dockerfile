FROM mcr.microsoft.com/dotnet/sdk:7.0.304-bullseye-slim-amd64

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    zip \
    vim \
    unzip \
    git \
    curl \
    && apt-get clean

# Install dotnet-ef and code generator
RUN dotnet tool install --global dotnet-ef && dotnet tool install -g dotnet-aspnet-codegenerator

# Add dotnet tools to path at end of bashrc
RUN echo export PATH="$PATH:$HOME/.dotnet/tools/" >> ~/.bashrc 

# Install Sqlite3
RUN apt-get update && apt-get install -y sqlite3 libsqlite3-dev

RUN mkdir /database /app

# Set working directory
WORKDIR /app

# cmd to keep container running
CMD tail -f /dev/null