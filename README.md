# Huebot Hub Core 
Yarn workspace containing API, MQTT transport, Native packages

## Development Setup
- Make sure corepack has been enabled: `sudo corepack enable` (not sure why `sudo` req'd)
- Update global Yarn version: `corepack prepare yarn@stable --activate`
- In repo dir: `yarn set version berry`
- Add `nodeLinker: node-modules` to `.yarnrc.yml` file
- Run `yarn`
- Run `yarn workspace @huebot-hub-core/common build` (Not sure why this needs to be done outside the container - need to look into this)
- Note: When initially running you might get the following error: "QueryFailedError: SQLITE_BUSY: database is locked". I believe this is due to TypeORM synchronizing the db, let it run fully. Should not occur on restart. 

## Packages
Run all packages in development with `docker-compose -f docker-compose.dev.yml up` or production with `docker-compose -f docker-compose.prod.yml up`

### API

#### Run (development)
`docker-compose -f docker-compose.dev.yml up api`

#### Build
`docker build -t ghcr.io/huebot-iot/hub-core-api:[version] -t ghcr.io/huebot-iot/hub-core-api:latest --target api_production .`

#### Push
1. `docker push ghcr.io/huebot-iot/hub-core-api:[version]`
2. `docker push ghcr.io/huebot-iot/hub-core-api:latest` (just tags as 'latest')

### Native

#### Run (development)
`docker-compose -f docker-compose.dev.yml up native`

#### Build
`docker build -t ghcr.io/huebot-iot/hub-core-native:[version] -t ghcr.io/huebot-iot/hub-core-native:latest --target native_production .`

#### Push
1. `docker push ghcr.io/huebot-iot/hub-core-native:[version]`
2. `docker push ghcr.io/huebot-iot/hub-core-native:latest` (just tags as 'latest')

### MQTT Transporter

#### Run (development)
`docker-compose -f docker-compose.dev.yml up mqtt`

#### Build
`docker build -t ghcr.io/huebot-iot/hub-core-mqtt:[version] -t ghcr.io/huebot-iot/hub-core-mqtt:latest --target mqtt_production .`

#### Push
1. `docker push ghcr.io/huebot-iot/hub-core-mqtt:[version]`
2. `docker push ghcr.io/huebot-iot/hub-core-mqtt:latest` (just tags as 'latest')

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

## License
See [License.txt](https://github.com/huebot-iot/hub-core/blob/main/LICENSE.txt)

Huebot is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Huebot is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

A full copy of the GNU General Public License can be found at http://www.gnu.org/licenses/gpl-3.0.en.html

This software includes third party open source software components. Please see individual files for license information, if applicable.