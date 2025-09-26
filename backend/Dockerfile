FROM node:20-alpine
RUN adduser -D appuser
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER appuser
EXPOSE 4000
CMD ["node", "index.js"]