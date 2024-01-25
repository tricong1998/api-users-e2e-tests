ARG NODE_VERSION=18-alpine

#1 base
FROM node:${NODE_VERSION} as base

#2 server-dev to install devDependences
FROM base As server-dev
ARG DIR=/usr/src/app
WORKDIR ${DIR}
COPY package*.json ${DIR}/
RUN npm ci


#1 server-builder to build app
# copy node_modules (devDependences) from server-dev
# copy source code to build
FROM base as server-builder
ARG DIR=/usr/src/app
WORKDIR ${DIR}
COPY . .
COPY --from=server-dev /usr/src/app/node_modules ${DIR}/node_modules
RUN npm run build

#4 server-prod to install prodDependences
FROM base as server-prod
ARG DIR=/usr/src/app
WORKDIR ${DIR}
COPY package*.json ${DIR}/
RUN npm ci --production --ignore-scripts

#5 server
FROM base as server
ARG DIR=/usr/src/app
WORKDIR ${DIR}
COPY --from=server-prod /usr/src/app/node_modules ${DIR}/node_modules
COPY --from=server-builder /usr/src/app/dist ${DIR}/dist
CMD [ "node", "dist/main.js" ]