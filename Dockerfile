FROM node:20.9.0-alpine As Development

# Create app directory
WORKDIR /usr/src/app
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN yarn install
COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "node", "dist/main.js" ]