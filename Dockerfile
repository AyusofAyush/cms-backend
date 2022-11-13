FROM node:latest
ENV REDIS_HOST=redis
ENV MONGO_PORT=27071
WORKDIR /srv/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["node", "dist/app.js"]