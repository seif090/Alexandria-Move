FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Alexandria.API/Alexandria.API.csproj", "src/Alexandria.API/"]
COPY ["src/Alexandria.Application/Alexandria.Application.csproj", "src/Alexandria.Application/"]
COPY ["src/Alexandria.Domain/Alexandria.Domain.csproj", "src/Alexandria.Domain/"]
COPY ["src/Alexandria.Infrastructure/Alexandria.Infrastructure.csproj", "src/Alexandria.Infrastructure/"]
RUN dotnet restore "src/Alexandria.API/Alexandria.API.csproj"
COPY . .
WORKDIR "/src/src/Alexandria.API"
RUN dotnet build "Alexandria.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Alexandria.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Alexandria.API.dll"]
