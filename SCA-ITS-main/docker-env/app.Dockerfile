FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1
ENV ASPNETCORE_URLS=http://0.0.0.0:5000;http://0.0.0.0:5009

WORKDIR /app

RUN apt update && apt install libssl-dev -y && apt install ca-certificates -y
RUN apt install -y wget
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt install ./google-chrome-stable_current_amd64.deb -y

COPY ./publish /app

CMD ["./back-end"]