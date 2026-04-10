# Frontend Docker Assignment

## Overview

This project demonstrates how to containerize a frontend application using Docker.
The application is built with React (Vite) and served using Nginx in a production environment.

---

## Features

* React frontend (Vite)
* Multi-stage Docker build
* Lightweight production image
* Served with Nginx

---

## Project Structure

```
frontend-docker/
├── src/
├── public/
├── Dockerfile
├── .dockerignore
├── package.json
└── README.md
```

---

## How to Run

### 1. Build Docker Image

```
docker build -t frontend-app .
```

### 2. Run Container

```
docker run -d -p 3000:80 frontend-app
```

### 3. Access Application

Open in browser:

```
http://10.34.112.134:3000
```

---

## Docker Concepts Used

### Multi-stage Build

The Dockerfile uses multi-stage build to:

* Build the React app in Node.js
* Serve static files using Nginx

This helps reduce final image size.

---

## Dockerfile Highlights

* Uses `node:20-alpine` for build stage
* Uses `nginx:alpine` for production
* Copies only necessary files to final image

---

## .dockerignore

The `.dockerignore` file excludes unnecessary files such as:

```
node_modules
dist
.git
```

This keeps the Docker image clean and small.

---

## Image Size

The final Docker image is optimized and kept under 300MB using multi-stage build.

---

## Screenshots

### Running Container
<img width="1166" height="68" alt="image" src="https://github.com/user-attachments/assets/4be7be62-8692-443b-a0ee-0fd36cf011e4" />


### Application Running
<img width="926" height="825" alt="image" src="https://github.com/user-attachments/assets/967dea90-de12-4488-80e6-97970383200e" />

---

## Conclusion

This project successfully demonstrates how to containerize a frontend application and deploy it using Docker with best practices such as multi-stage builds and production-ready serving with Nginx.
