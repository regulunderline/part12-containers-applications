FROM node:20
  
WORKDIR /usr/src/app

COPY . .

RUN npm i

CMD ["npm", "run", "dev", "--", "--host"]
