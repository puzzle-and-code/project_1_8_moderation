FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Domain/Domain.csproj Domain/
COPY Application/Application.csproj Application/
COPY Infrastructure/Infrastructure.csproj Infrastructure/
COPY API/API.csproj API/
RUN dotnet restore API/API.csproj

COPY Domain/ Domain/
COPY Application/ Application/
COPY Infrastructure/ Infrastructure/
COPY API/ API/
RUN dotnet publish API/API.csproj -c Release -o /app/publish /p:UseAppHost=false --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
USER $APP_UID

ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Development

EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "API.dll"]
