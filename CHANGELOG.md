# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.1.0-beta.6](https://github.com/huebot-iot/huebot/compare/0.1.0-beta.3...0.1.0-beta.6) (2023-05-31)

**Note:** Version bump only for package @huebot/main

# [0.1.0-beta.5](https://github.com/huebot-iot/huebot/compare/0.1.0-beta.3...0.1.0-beta.5) (2023-05-31)

**Note:** Version bump only for package @huebot/main

# [0.1.0-beta.4](https://github.com/huebot-iot/huebot/compare/0.1.0-beta.3...0.1.0-beta.4) (2023-05-31)

**Note:** Version bump only for package @huebot/main

# [0.1.0-beta.2](https://github.com/huebot-iot/huebot/compare/0.1.0-beta.1...0.1.0-beta.2) (2023-05-29)

**Note:** Version bump only for package @huebot/main

# 0.1.0-beta.1 (2023-05-22)

### Bug Fixes

* Fix install script to get new version of Docker and add user to Docker group (RPi compatibility)

# 0.1.0-beta.0 (2023-05-21)

### Features
* **user/auth:** user endpoint with auth and simple role support
* **unit testing:** unit testing for controller (only user so far)
* **admin:** endpoint (not served by NGINX) to allow for admin account creation via CLI
* **SQLite:** setup for all environments (dev, prod, testing)
* **migrations:** TypeORM migration support
* **MQTT transport:** layered over MQTT broker for message/event listening
