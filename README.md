# Todo_Application

# Docker Getting Started Workshop

## Overview

This project demonstrates the core Docker concepts required to build, package, distribute, and run modern containerized applications. The application is a simple Todo application backed by MySQL and containerized using Docker and Docker Compose.

---

# Part 1: Containerize an Application

## Objective

Package the application and its dependencies into a Docker image.

## Dockerfile

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## Build the Image

```bash
docker build -t getting-started .
```

## Run the Container

```bash
docker run -dp 8080:3000 getting-started
```

---

# Part 2: Update the Application

## Objective

Modify the application and rebuild the image.

Update the source code and rebuild:

```bash
docker build -t getting-started .
docker run -dp 8080:3000 getting-started
```

Alternatively, use bind mounts during development to avoid rebuilding after every change.

---

# Part 3: Share the Application

## Objective

Push the image to Docker Hub.

### Tag the Image

```bash
docker tag getting-started username/getting-started:latest
```

### Push the Image

```bash
docker push username/getting-started:latest
```

### Pull and Run

```bash
docker pull username/getting-started:latest

docker run -dp 8080:3000 username/getting-started:latest
```

---

# Part 4: Persist the Database

## Objective

Store database data outside the container lifecycle.

### Create Volume

```bash
docker volume create todo-db
```

### Run MySQL with Volume

```bash
docker run -d \
  --name mysql \
  -v todo-db:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=todos \
  mysql:8.0
```

### Verify Persistence

Stop and remove the container.

```bash
docker rm -f mysql
```

Create a new container using the same volume and verify the data still exists.

---

# Part 5: Use Bind Mounts

## Objective

Enable live code updates without rebuilding images.

### Run with Bind Mount

```bash
docker run -dp 8080:3000 \
  -w /app \
  -v "$(pwd):/app" \
  node:24-alpine \
  sh -c "npm install && npm run dev"
```

### Benefits

* Instant code changes
* Faster development cycle
* No image rebuild required

---

# Part 6: Multi-Container Applications

## Objective

Separate application and database into independent containers.

### Create Network

```bash
docker network create todo-app
```

### Run MySQL

```bash
docker run -d \
  --network todo-app \
  --network-alias mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=todos \
  mysql:8.0
```

### Run Application

```bash
docker run -dp 8080:3000 \
  --network todo-app \
  -e MYSQL_HOST=mysql \
  getting-started
```

### Benefits

* Independent scaling
* Service isolation
* Easier maintenance

---

# Part 7: Use Docker Compose

## Objective

Define and manage multi-container applications using a single YAML file.

## docker-compose.yml

```yaml
services:
  app:
    image: node:24-alpine
    command: sh -c "npm install && npm run dev"
    ports:
      - "8080:3000"
    working_dir: /app
    volumes:
      - ./:/app
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - todo-app

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos
    volumes:
      - todo-mysql-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-psecret"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - todo-app

volumes:
  todo-mysql-data:

networks:
  todo-app:
    driver: bridge
```

### Start Application

```bash
docker compose up -d
```

### Stop Application

```bash
docker compose down
```

---

# Part 8: Image Building Best Practices

## Use Small Base Images

Prefer Alpine-based images:

```dockerfile
FROM node:24-alpine
```

## Use Layer Caching

```dockerfile
COPY package*.json ./
RUN npm install

COPY . .
```

## Use .dockerignore

```text
node_modules
.git
.gitignore
Dockerfile
README.md
```

## Run as Non-Root User

```dockerfile
RUN addgroup -S app && adduser -S app -G app
USER app
```

## Multi-Stage Builds

```dockerfile
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app .

CMD ["npm","start"]
```

## Scan Images

```bash
docker scout quickview
```

## Remove Unused Resources

```bash
docker image prune -a
docker system prune -a
```

---

# Architecture

```text
+--------------------+
|      Browser       |
+---------+----------+
          |
          v
+--------------------+
|   Node.js App      |
|   Port 3000        |
+---------+----------+
          |
          v
+--------------------+
|      MySQL         |
| Persistent Volume  |
+--------------------+
```

---

# Key Concepts Learned

* Docker Images
* Containers
* Volumes
* Bind Mounts
* Networks
* Multi-Container Applications
* Docker Compose
* Health Checks
* Image Optimization
* Container Best Practices


