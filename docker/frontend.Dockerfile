FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY ./frontend/react-app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY ./frontend/react-app .

# Build and serve
RUN npm run build
EXPOSE 3000
CMD ["npx", "vite", "preview", "--host", "--port", "3000"]
