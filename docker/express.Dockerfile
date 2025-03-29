FROM node:18-alpine
WORKDIR /app

# Copy backend folder
COPY ./backend .

# Install required packages 
RUN npm install express cors

# Debug - show what's in the directories
RUN ls -la
RUN ls -la express_api || echo "express_api not found"
RUN ls -la shared || echo "shared not found"

# Change working directory to express_api
WORKDIR /app/express_api

# Listen on all interfaces
EXPOSE 5001

# Start the server with debugging output
CMD echo "Container files:" && find /app -type f | grep -v "node_modules" && node index.js