FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM node:20-alpine
RUN adduser -D appuser
WORKDIR /app
COPY --from=build /app/dist ./dist
USER appuser
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
