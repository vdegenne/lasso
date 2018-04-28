FROM node:carbon
WORKDIR /app
# COPY package*.json ./
# RUN yarn install
# Just copy all
COPY . .
CMD yarn start