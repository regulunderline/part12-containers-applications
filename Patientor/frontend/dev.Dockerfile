FROM node:20

WORKDIR /usr/src/frontend

COPY . .

RUN npm install

CMD ["npm", "run", "dev", "--", "--host"]
