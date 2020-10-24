FROM node:14.14.0-buster

RUN mkdir /app && cd /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY . /app
RUN npx eslint /app/*.js

ENTRYPOINT ["node", "/app/app.js" ]