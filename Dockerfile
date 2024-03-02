FROM node:20.11.1-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5000

ENV PORT 5000

CMD ["npm", "run", "dev"]