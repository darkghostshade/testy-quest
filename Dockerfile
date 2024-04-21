FROM node:20.11.1-alpine

WORKDIR /app

COPY package.json .

RUN npm install --silent && \
    npm install react-bootstrap bootstrap --silent

COPY . .   

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["npm", "start"]