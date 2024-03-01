FROM node:20.11.1-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm i

USER node

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]