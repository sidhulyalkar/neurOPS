FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app (src, public, etc.)
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Serve built app
CMD ["npm", "run", "start"]
