# # Use Node.js as the base image
# FROM node:18

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json files
# COPY package*.json ./



# # Copy the rest of the application code
# # Copy only the built application from the previous stage
# COPY . .

# # Install dependencies
# RUN npm install
# # Ensure Prisma Client is generated
# RUN npx prisma generate
# # Generate Database
# RUN npx prisma migrate dev

# # Build the Next.js application
# RUN npm run build



# # Expose the port the app runs on
# EXPOSE 3000

# # Start the Next.js application
# CMD ["npm", "start"]
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate the database schema
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
