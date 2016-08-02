FROM mhart/alpine-node:latest

RUN apk add --update \
    --no-cache make gcc g++ python

RUN adduser -D app

ENV HOME=/home/app
ENV NODE_ENV=production

COPY package.json npm-shrinkwrap.json $HOME/server/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/server
RUN npm install --no-optional

USER root
COPY . $HOME/server
RUN chown -R app:app $HOME/*
USER app

RUN ["npm", "run", "build"]
CMD ["node", "build/app.js"]