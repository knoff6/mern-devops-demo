FROM node:20-alpine
RUN adduser -D appuser
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY . .
USER appuser
EXPOSE 4000
CMD ["npm", "start"]
