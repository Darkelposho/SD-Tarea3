FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
RUN npm install express request@2.81.0 dotenv cors body-parser nodemon avsc cassandra-driver uuid
# Bundle app source
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]