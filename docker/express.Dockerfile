FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install express cors swagger-ui-express swagger-jsdoc
CMD ["node", "index.js"]
