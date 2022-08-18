FROM node:14-alpine

RUN npm install

CMD ["node", "index.js"]