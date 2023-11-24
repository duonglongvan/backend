FROM node:alpine
RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app
WORKDIR /usr/src/node-app
COPY package.json yarn.lock ./
COPY .env ./
USER node
RUN yarn install --pure-lockfile
COPY --chown=node:node . .
EXPOSE 8500
CMD [ "yarn", "start" ]
