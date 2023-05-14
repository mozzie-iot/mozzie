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
RUN yarn workspace @huebot-hub-core/common install
RUN yarn workspace @huebot-hub-core/common build

# ##################
# API DEVELOPMENT
# ##################
FROM node:18-slim AS api_development

# Needed to reload app when watching for changes
RUN apt-get update && apt-get -y install procps

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .

WORKDIR /usr/app/packages/common
COPY --chown=node:node packages/common/package.json .
COPY --chown=node:node --from=common_build /usr/app/packages/common/dist ./dist

WORKDIR /usr/app/packages/api
COPY --chown=node:node packages/api/package.json .

WORKDIR /usr/app
RUN yarn workspace @huebot-hub-core/api install

COPY --chown=node:node packages/api ./packages/api

USER node

###################
# API TEST
###################
FROM node:18-slim AS api_test

WORKDIR /usr
RUN mkdir -p db
RUN chown node db

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node packages/common/package.json ./common/package.json
# COPY --chown=node:node --from=common_build /usr/app/packages/common/dist ./common/dist
COPY --chown=node:node packages/api/package.json ./api/package.json
COPY --chown=node:node packages/api ./packages/api

WORKDIR /usr/app
RUN yarn workspace @huebot-hub-core/api install
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
COPY --chown=node:node --from=api_development /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=api_development /usr/app/packages/common ./packages/common
COPY --chown=node:node packages/api ./packages/api
RUN yarn workspace @huebot-hub-core/api build

# Needed to use 'yarn workspaces focus' which installs prod deps in current dir (yarn 2)
RUN yarn plugin import workspace-tools

ENV NODE_ENV production

WORKDIR /usr/app/packages/api
# Only install production packages for current folder (overrides install from development stage)
RUN yarn workspaces focus --production

USER node

###################
# API PRODUCTION
###################
FROM node:18-alpine AS api_production
LABEL org.opencontainers.image.source https://github.com/huebot-iot/hub-core

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node --from=api_build /usr/app/node_modules ./node_modules

RUN cat /usr/app/package.json

WORKDIR /usr/app/packages/common
COPY --chown=node:node packages/common/package.json .
COPY --chown=node:node --from=common_build /usr/app/packages/common/dist ./dist

WORKDIR /usr/app/packages/api
COPY --chown=node:node --from=api_build /usr/app/packages/api/dist ./dist
ENV NODE_ENV production
COPY --chown=node:node docker-entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh
CMD ./entrypoint.sh

###################
# MQTT DEVELOPMENT
###################
FROM node:18-slim AS mqtt_development

# Needed to reload app when watching for changes
RUN apt-get update && apt-get -y install procps

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .

WORKDIR /usr/app/packages/common
COPY --chown=node:node packages/common/package.json .
COPY --chown=node:node --from=common_build /usr/app/packages/common/dist ./dist

WORKDIR /usr/app/packages/mqtt
COPY --chown=node:node packages/mqtt/package.json .

WORKDIR /usr/app
RUN yarn workspace @huebot-hub-core/mqtt install

COPY --chown=node:node packages/mqtt ./packages/mqtt

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
COPY --chown=node:node --from=mqtt_development /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=mqtt_development /usr/app/packages/common ./packages/common
COPY --chown=node:node packages/mqtt ./packages/mqtt
RUN yarn workspace @huebot-hub-core/mqtt build

# Needed to use 'yarn workspaces focus' which installs prod deps in current dir (yarn 2)
RUN yarn plugin import workspace-tools

ENV NODE_ENV production

WORKDIR /usr/app/packages/mqtt
# Only install production packages for current folder (overrides install from development stage)
RUN yarn workspaces focus --production

USER node

###################
# MQTT PRODUCTION
###################
FROM node:18-alpine AS mqtt_production
LABEL org.opencontainers.image.source https://github.com/huebot-iot/hub-core
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