FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install bcrypt
RUN npm install jsonwebtoken
RUN npm install cors

COPY . .

EXPOSE 3000
CMD ["npm", "start"]