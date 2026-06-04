FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=dev

COPY . .

RUN addgroup -S app && adduser -S app -G app

USER app

EXPOSE 3000

CMD ["node", "src/index.js"]
