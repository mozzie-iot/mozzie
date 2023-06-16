###################
# COMMON BUILD
###################
FROM node:18-slim AS common_build

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .

WORKDIR /usr/app/packages/common
COPY --chown=node:node packages/common/package.json .
COPY --chown=node:node packages/common/tsconfig.json .
COPY packages/common/src ./src

WORKDIR /usr/app
RUN yarn workspace @huebot/common install
RUN yarn workspace @huebot/common build

# ##################
# API DEVELOPMENT
# ##################
FROM node:18-slim AS api_development

# Needed to reload app when watching for changes
RUN apt-get update && apt-get -y install procps

WORKDIR /usr/app/packages
COPY --chown=node:node packages/common ./common
COPY --chown=node:node packages/api ./api

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .

USER node

###################
# API TEST
###################
FROM node:18-slim AS api_test

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node packages/common/package.json ./packages/common/package.json
COPY --chown=node:node --from=common_build /usr/app/packages/common/dist ./packages/common/dist
COPY --chown=node:node packages/api ./packages/api

WORKDIR /usr/app
RUN yarn workspace @huebot/api install
USER node

###################
# API BUILD (FOR PRODUCTION)
###################
FROM node:18-alpine AS api_build

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .

COPY --chown=node:node --from=api_test /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=api_test /usr/app/packages/common ./packages/common
COPY --chown=node:node packages/api ./packages/api
RUN yarn workspace @huebot/api build

# Needed to use 'yarn workspaces focus' which installs prod deps in current dir (yarn 2)
RUN yarn plugin import workspace-tools

ENV NODE_ENV production

WORKDIR /usr/app/packages/common
# Install common production packages
RUN yarn workspaces focus --production

WORKDIR /usr/app/packages/api
# Install API production packages
RUN yarn workspaces focus --production

USER node

###################
# API PRODUCTION
###################
FROM node:18-alpine AS api_production
LABEL org.opencontainers.image.source https://github.com/huebot-iot/huebot

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node --from=api_build /usr/app/node_modules ./node_modules

WORKDIR /usr/app/packages/common
COPY --chown=node:node packages/common/package.json .
COPY --chown=node:node --from=common_build /usr/app/packages/common/dist ./dist

WORKDIR /usr/app/packages/api
COPY --chown=node:node --from=api_build /usr/app/packages/api/dist ./dist
ENV NODE_ENV production
COPY --chown=node:node docker/docker-entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh
CMD ./entrypoint.sh

###################
# MQTT DEVELOPMENT
###################
FROM node:18-slim AS mqtt_development

# Needed to reload app when watching for changes
RUN apt-get update && apt-get -y install procps

WORKDIR /usr/app/packages
COPY --chown=node:node packages/common ./common
COPY --chown=node:node packages/api ./mqtt

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .

USER node

###################
# MQTT TEST
###################
FROM node:18-slim AS mqtt_test

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node packages/common/package.json ./packages/common/package.json
COPY --chown=node:node --from=common_build /usr/app/packages/common/dist ./packages/common/dist
COPY --chown=node:node packages/mqtt ./packages/mqtt

WORKDIR /usr/app
RUN yarn workspace @huebot/mqtt install
USER node

###################
# MQTT BUILD (FOR PRODUCTION)
###################
FROM node:18-alpine AS mqtt_build

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .

COPY --chown=node:node --from=mqtt_test /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=mqtt_test /usr/app/packages/common ./packages/common
COPY --chown=node:node packages/mqtt ./packages/mqtt
RUN yarn workspace @huebot/mqtt build

# Needed to use 'yarn workspaces focus' which installs prod deps in current dir (yarn 2)
RUN yarn plugin import workspace-tools

ENV NODE_ENV production

WORKDIR /usr/app/packages/common
# Install common production packages
RUN yarn workspaces focus --production

WORKDIR /usr/app/packages/mqtt
# Install MQTT production packages
RUN yarn workspaces focus --production

USER node

###################
# MQTT PRODUCTION
###################
FROM node:18-alpine AS mqtt_production
LABEL org.opencontainers.image.source https://github.com/huebot-iot/huebot

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node --from=mqtt_build /usr/app/node_modules ./node_modules

WORKDIR /usr/app/packages/common
COPY --chown=node:node packages/common/package.json .
COPY --chown=node:node --from=mqtt_build /usr/app/packages/common/dist ./dist

WORKDIR /usr/app/packages/mqtt
COPY --chown=node:node --from=mqtt_build /usr/app/packages/mqtt/dist ./dist
ENV NODE_ENV production
CMD [ "node", "dist/main.js" ]

# ##################
# CLIENT DEVELOPMENT
# ##################
FROM node:18-slim AS client_development

WORKDIR /usr/app/packages
COPY --chown=node:node packages/client ./client

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .

USER node