## Huebot Hub Core 
### All Nest-based packages (API, MQTT transport, TCP transport) in a yarn workspace sharing common resources 
### (Will replace hub and hub-core repos)

### Run (development):
`docker-compose -f docker-compose.dev.yml up`
Note: worth developing in Docker container as some services are referenced by their Docker container name (redis, postgres)

### Build:
`docker build -t ghcr.io/huebot-iot/hub-core-next:[version] -t ghcr.io/huebot-iot/hub-core-next:latest -f ./docker/Dockerfile.api .`

### Push:
1. `docker push ghcr.io/huebot-iot/hub-core-next:[version]`
2. `docker push ghcr.io/huebot-iot/hub-core-next:latest` (just tags as 'latest')

### Notes
For `denied: permission_denied: The token provided does not match expected scopes.` error, login into GHCR with `docker login ghcr.io`