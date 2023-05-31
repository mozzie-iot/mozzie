path = require('path');
fs = require('fs');
yaml = require('js-yaml');

package = require(path.join('../packages', 'api', 'package.json'));

console.log('API VERSION: ', package.version);

// const compose_file = yaml.load(
//   fs.readFileSync('./docker/docker-compose.prod.yml', 'utf8')
// );

// compose_file.services[package_name].image =
//   'ghcr.io/huebot-iot/' + package_name + ':' + package.version;

// const yaml_compose_file = yaml.dump(compose_file);

// fs.writeFileSync('./docker/docker-compose.prod.yml', yaml_compose_file);

// console.log(
//   'Updated the ' +
//     package_name +
//     ' package to ' +
//     package.version +
//     ' in docker-compose.prod.yml'
// );
