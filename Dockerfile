FROM node:20.11.1-alpine

WORKDIR /app

COPY package.json .

RUN npm install --silent && \
    npm install react-bootstrap bootstrap --silent

COPY . .   


EXPOSE 3000

CMD ["npm", "start"]