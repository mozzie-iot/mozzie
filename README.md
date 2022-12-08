# Huebot Hub Core 
(Will replace hub and hub-core repos)

## Packages
Run all packages in development with `docker-compose -f docker-compose.dev.yml up` or production with `docker-compose -f docker-compose.prod.yml up`

### API

#### Run (development)
`docker-compose -f docker-compose.dev.yml up api`

#### Build
`docker build -t ghcr.io/huebot-iot/hub-core-api:[version] -t ghcr.io/huebot-iot/hub-core-api:latest -f ./docker/Dockerfile.api .`

#### Push
1. `docker push ghcr.io/huebot-iot/hub-core-api:[version]`
2. `docker push ghcr.io/huebot-iot/hub-core-api:latest` (just tags as 'latest')

### Native

#### Run (development)
`docker-compose -f docker-compose.dev.yml up native`

#### Build
`docker build -t ghcr.io/huebot-iot/hub-core-native:[version] -t ghcr.io/huebot-iot/hub-core-native:latest -f ./docker/Dockerfile.native .`

#### Push
1. `docker push ghcr.io/huebot-iot/hub-core-native:[version]`
2. `docker push ghcr.io/huebot-iot/hub-core-native:latest` (just tags as 'latest')

## DB Migrations
- Run migration commands inside Docker container: `docker exec -it huebot_api_dev sh`
- Must build `common` (`yarn workspace @huebot-hub-core/common build`) package before running migrations (migrations must be located in dist dir)

### Generating migration
`yarn migration:generate [migration_name]`
- Database must not reflect that schema change in order to successfully generate schema 
- When schema is ready to be generated (after developing in development environment with `synchronize` enabled):
1. Spin up docker container pointing to temp database outside db volumes path (so db won't persist - assuming you want to persist development data, otherwise deleting existing database would suffice) and <b>set synchronize to false</b>
2. Run `yarn migration:run` to bring database to current state
3. Run `yarn migration:generate [migration_name]`

### Create migration
`yarn migration:create [migration_name]`
- Created empty migration file allowing entry of custom SQL command

### Run migration
`yarn migration:run`

### Revert migration
`yarn migration:revert`

## Notes
- For `denied: permission_denied: The token provided does not match expected scopes.` error, login into GHCR with `docker login ghcr.io`
- Issues pushing larger Docker images over SSH connection. May need to put hub on WiFi network if getting `connection reset by peer` timeout