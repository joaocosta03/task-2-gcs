FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install bcrypt
RUN npm install jsonwebtoken
RUN npm install cors
RUN npm install dotenv
RUN npm install cross-env

COPY . .

EXPOSE 3000
CMD ["npm", "start"]