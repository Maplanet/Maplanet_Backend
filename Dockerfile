FROM node:18-alpine As development
# pm2 설치
RUN npm install pm2 -g
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 3000
CMD ["pm2-runtime","start", "ecosystem.config.js" "dist/main.js"]
