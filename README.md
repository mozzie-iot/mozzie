![version](https://img.shields.io/github/v/release/huebot-iot/huebot)
![core-deploy](https://github.com/huebot-iot/hub-core/actions/workflows/deploy.yml/badge.svg)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Description
Huebot is an IoT framework that allows clients to be controlled or sensed via HTTP endpoint. 
<br><br>
While Huebot makes use of a number of libraries, core functionality is made possible by [Mosquitto](https://github.com/eclipse/mosquitto), [NGINX](https://github.com/nginx), [NestJS](https://github.com/nestjs/nest) and [MicroPython](https://github.com/micropython/micropython)

## Getting Started
1. Install the CLI:<br>
`bash <(wget -qO- http://huebot-cli.s3-website-us-east-1.amazonaws.com/install.sh)`
2. Install the Huebot environment:<br>
`sudo huebot install` (sudo is required to install apt-get packages and create directories)
3. Create an admin user:<br>
`huebot create-admin` (required to access API endpoints)

## Test API Endpoint
1. Login
```
curl -X POST http://[computer name OR IP address]/user/login \
   -H "Content-Type: application/json" \
   -d '{"username": "my_username", "password": "my_password"}'
```
If successful, this will return an access token and refresh token<br>

2. Get current user
```
curl http://[computer name OR IP address]/user/me \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer [access token]" 
```
## CLI commands
- `install`<br>
Install and run environment
- `uninstall`<br>
Uninstall environment
- `hub-version`<br>
Get currently installed environment version
- `create-admin`<br>
Create admin user (required to get started with http endpoints)

## Development Setup
- `git clone https://github.com/huebot-iot/huebot.git`
- `cd huebot && yarn`
- `yarn workspace @huebot-hub-core/common build`
- `COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker/docker-compose.dev.yml build`
- `docker-compose -f docker/docker-compose.dev.yml up `

## License
See [License.txt](https://github.com/huebot-iot/hub-core/blob/main/LICENSE.txt)

Huebot is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Huebot is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

A full copy of the GNU General Public License can be found at http://www.gnu.org/licenses/gpl-3.0.en.html

This software includes third party open source software components. Please see individual files for license information, if applicable.
