FROM node:14-alpine

COPY . . 

RUN npm install

CMD ["node", "index.js"]