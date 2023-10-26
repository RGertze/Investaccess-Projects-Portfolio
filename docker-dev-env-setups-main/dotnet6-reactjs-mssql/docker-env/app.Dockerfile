FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1
ENV ASPNETCORE_URLS=http://0.0.0.0:5000;http://0.0.0.0:5009

WORKDIR /app

RUN apt update && apt install libssl-dev -y && apt install ca-certificates -y

COPY ./publish /app

CMD ["./back-end"]