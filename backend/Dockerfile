FROM node:20-alpine
RUN adduser -D appuser
WORKDIR /app
COPY package*.json ./
#
# Use npm install (no lockfile required) to enable container-only setup.
RUN npm install --omit=dev && npm cache clean --force
COPY . .
USER appuser
EXPOSE 5000
CMD ["npm", "start"]