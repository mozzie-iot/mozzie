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

###################
# API DEVELOPMENT
###################
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
FROM node:18-alpine As api_production
LABEL org.opencontainers.image.source https://github.com/huebot-iot/hub-core-next

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
CMD [ "node", "dist/main.js" ]


###################
# NATIVE DEVELOPMENT
###################
FROM node:18-slim AS native_development

RUN apt update && apt install -y network-manager procps

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .

WORKDIR /usr/app/packages/common
COPY --chown=node:node packages/common/package.json .
COPY --chown=node:node --from=common_build /usr/app/packages/common/dist ./dist

WORKDIR /usr/app/packages/native
COPY --chown=node:node packages/native/package.json .

WORKDIR /usr/app
RUN yarn workspace @huebot-hub-core/native install

COPY --chown=node:node packages/native .packages/native

# Give node group NMCLI access
RUN chgrp node /usr/bin/nmcli
RUN chmod o= /usr/bin/nmcli
RUN chmod u+s,a-w /usr/bin/nmcli

USER node

###################
# NATIVE BUILD (FOR PRODUCTION)
###################
FROM node:18-alpine AS native_build

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node --from=native_development /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=native_development /usr/app/packages/common ./packages/common
COPY --chown=node:node packages/native ./packages/native
RUN yarn workspace @huebot-hub-core/native build

# Needed to use 'yarn workspaces focus' which installs prod deps in current dir (yarn 2)
RUN yarn plugin import workspace-tools

ENV NODE_ENV production

WORKDIR /usr/app/packages/native
# Only install production packages for current folder (overrides install from development stage)
RUN yarn workspaces focus --production

USER node

###################
# NATIVE PRODUCTION
###################
FROM node:18-slim As native_production
LABEL org.opencontainers.image.source https://github.com/huebot-iot/hub-core-next

RUN apt update && apt install -y network-manager 

WORKDIR /usr/app
COPY --chown=node:node package.json .
COPY --chown=node:node --from=native_build /usr/app/node_modules ./node_modules

WORKDIR /usr/app/packages/common
COPY --chown=node:node packages/common/package.json .
COPY --chown=node:node --from=common_build /usr/app/packages/common/dist ./dist

# Give node group NMCLI access
RUN chgrp node /usr/bin/nmcli
RUN chmod o= /usr/bin/nmcli
RUN chmod u+s,a-w /usr/bin/nmcli

WORKDIR /usr/app/packages/native
COPY --chown=node:node --from=native_build /usr/app/packages/native/dist ./dist
ENV NODE_ENV production
CMD [ "node", "dist/main.js" ]
USER node


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
FROM node:18-alpine As mqtt_production
LABEL org.opencontainers.image.source https://github.com/huebot-iot/hub-core-next
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
