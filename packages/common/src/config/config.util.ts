import { readFileSync } from 'node:fs';

interface MqttConfig {
  mqtt_username: string;
  mqtt_password: string;
}

export const configParseMqtt = () => {
  const config_str = readFileSync('/usr/app/mqtt-config.json', {
    encoding: 'utf8',
    flag: 'r',
  });

  const config = JSON.parse(config_str) as MqttConfig;

  if (!config.mqtt_username || !config.mqtt_password) {
    throw Error(
      'Failed to parse MQTT config: mqtt_username and mqtt_password are required '
    );
  }

  return config;
};

interface HuebotConfig {
  api_key: string;
  secret_key: string;
}

export const configParseHuebot = () => {
  const config_str = readFileSync('/usr/app/huebot-config.json', {
    encoding: 'utf8',
    flag: 'r',
  });

  const config = JSON.parse(config_str) as HuebotConfig;

  if (!config.api_key || !config.secret_key) {
    throw Error(
      'Failed to parse Huebot config: api_key and secret_key are required '
    );
  }

  return config;
};
