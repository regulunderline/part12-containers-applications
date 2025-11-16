FROM node:20 AS build-stage 

WORKDIR /usr/src/frontend

COPY . .

RUN npm ci

ENV VITE_BACKEND_URL=http://localhost:8080/api/api

RUN npm run build

FROM nginx:1.25-alpine

COPY --from=build-stage /usr/src/frontend/dist /usr/share/nginx/html
