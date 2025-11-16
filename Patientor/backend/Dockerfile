FROM node:20
  
WORKDIR /usr/src/backend

COPY --chown=node:node . .

RUN npm ci 

CMD npm start
