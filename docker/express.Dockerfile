FROM node:18-alpine
WORKDIR /app

COPY backend/express_api .
COPY backend/shared ./shared

RUN npm install express cors

CMD ["node", "index.js"]
