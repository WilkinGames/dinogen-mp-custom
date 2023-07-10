FROM node:18-alpine3.17

COPY . .

RUN npm install

CMD ["npm", "start"]
