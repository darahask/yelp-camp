FROM node:12

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package*.json /home/node/app/
RUN npm install

COPY . /home/node/app/

EXPOSE 8080

CMD [ "npm", "start" ]