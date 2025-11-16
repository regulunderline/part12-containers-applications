FROM node:20
  
WORKDIR /usr/src/backend

COPY . .

RUN npm i

CMD ["npm", "run", "dev", "--", "--host"]
