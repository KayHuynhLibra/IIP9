FROM node:16
WORKDIR /app

# Copy all files first
COPY . .

# Install dependencies
RUN npm install

# Build Tailwind CSS
RUN npm run tailwind:build

EXPOSE 3000
CMD ["npm", "start"]