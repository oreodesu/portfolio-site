FROM node:20-alpine AS build
LABEL app="frontend-urlshortener"
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM nginx:1.27-alpine
LABEL app="frontend-urlshortener"
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
