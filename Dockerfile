# Use a lightweight base image compatible with Raspberry Pi
FROM arm32v7/debian:bullseye-slim

# Set working directory
WORKDIR /app

# Install dependencies and Node.js
RUN apt-get update && apt-get install -y curl gnupg
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN npm install node-screenlogic

# Copy the script
COPY index.js .

# Command to run the script with environment variables
CMD ["node", "index.js"]