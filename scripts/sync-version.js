// This script will sync the package versions in docker-compose.prod.yml
// It is executed by the Lerna's 'version' life cycle event when running
// 'lerna version' (included in deploy.sh)

// Note: Need to manually include which packages should be synced

path = require('path');
fs = require('fs');
yaml = require('js-yaml');

api_package = require('../packages/api/package.json');
mqtt_package = require('../packages/mqtt/package.json');

const compose_file = yaml.load(
  fs.readFileSync('./docker/docker-compose.prod.yml', 'utf8')
);

compose_file.services.api.image =
  'ghcr.io/huebot-iot/api:' + api_package.version;

compose_file.services.mqtt.image =
  'ghcr.io/huebot-iot/mqtt:' + mqtt_package.version;

const yaml_compose_file = yaml.dump(compose_file);

fs.writeFileSync('./docker/docker-compose.prod.yml', yaml_compose_file);

console.log('Image versions in docker-compose.prod.yml have been synced!');
