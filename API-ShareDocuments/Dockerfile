FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY API-ShareDocuments.sln ./
COPY API-ShareDocuments/API-ShareDocuments.csproj ./API-ShareDocuments/
COPY Application/Application.csproj ./Application/
COPY Domain/Domain.csproj ./Domain/
COPY Infrastructure/Infrastructure.csproj ./Infrastructure/
COPY Shared/Shared.csproj ./Shared/

RUN dotnet restore API-ShareDocuments.sln

COPY . .
WORKDIR /src/API-ShareDocuments
RUN dotnet publish -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 1107
ENV ASPNETCORE_URLS=http://+:1107

ENTRYPOINT ["dotnet", "API-ShareDocuments.dll"]