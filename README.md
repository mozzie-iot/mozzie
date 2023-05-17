![core-deploy](https://github.com/huebot-iot/huebot/actions/workflows/deploy.yml/badge.svg)

# Huebot 
Yarn workspace containing API and MQTT transport packages

## Development Setup
- `git clone https://github.com/huebot-iot/huebot.git`
- `cd huebot && yarn`
- `yarn workspace @huebot/common build`
- `COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker/docker-compose.dev.yml build`
- `docker-compose -f docker/docker-compose.dev.yml up `

## License
See [License.txt](https://github.com/huebot-iot/huebot/blob/main/LICENSE.txt)

Huebot is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Huebot is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

A full copy of the GNU General Public License can be found at http://www.gnu.org/licenses/gpl-3.0.en.html

This software includes third party open source software components. Please see individual files for license information, if applicable.
