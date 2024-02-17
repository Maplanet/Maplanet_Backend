FROM node:18-alpine As development
# pm2 설치
RUN npm install pm2 -g

RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN yarn install
RUN yarn build
#EXPOSE 3000
# pm2를 사용하여 애플리케이션 실행
CMD ["pm2-runtime", "dist/main.js"]
