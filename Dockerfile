# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and tsconfig.json to the working directory
COPY package*.json ./
COPY tsconfig.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source
COPY src/ ./src/

# Build the TypeScript code
RUN npm run build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Run the app when the container launches
CMD [ "node", "dist/index.js" ]
