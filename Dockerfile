# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve (non-root FIXED)
FROM nginx:alpine

# create user
RUN adduser -D appuser

# remove default html
RUN rm -rf /usr/share/nginx/html/*

# copy build
COPY --from=builder /app/dist /usr/share/nginx/html

# fix permissions (IMPORTANT)
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx /run \
    && chown -R appuser:appuser /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html /run

# change nginx to use port 8080
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

# fix pid location (IMPORTANT)
RUN sed -i 's#/run/nginx.pid#/tmp/nginx.pid#' /etc/nginx/nginx.conf

EXPOSE 8080

USER appuser

CMD ["nginx", "-g", "daemon off;"]
