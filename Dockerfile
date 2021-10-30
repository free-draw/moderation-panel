# BUILD
# Builds the panel

FROM node:16-alpine as builder

WORKDIR /app

COPY . .

# Install node-gyp dependencies
RUN apk add python3 gcc make g++

# Install pnpm
RUN npm install --global pnpm

# Install packages
RUN pnpm install --prod

# Run build
RUN pnpm run build

# HOST
# nginx image to host the panel

FROM nginx:1.21.1-alpine

# Remove default files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files to nginx default directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Apply custom nginx config
COPY ./nginx.conf /etc/nginx/nginx.conf

# Start nginx without daemon
CMD "nginx" "-g" "daemon off;"

EXPOSE 80/tcp