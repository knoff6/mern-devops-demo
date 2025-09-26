# MERN DevOps Demo

This demo runs a MERN app (frontend + backend + MongoDB) in Docker for local dev, and a Jenkins + SonarQube stack for CI/CD — **no host-side Node.js or MongoDB required**. Everything is containerized.

---

## ✅ What you DO need (Prerequisites)

- **Docker Engine 20.10+**
  - **Linux (Ubuntu 22.04/24.04):**
    - Install Docker from the official repo (recommended).
    - Install **Docker Compose v2** plugin:
      ```bash
      sudo apt-get update
      sudo apt-get install ca-certificates curl gnupg
      sudo install -m 0755 -d /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      sudo apt-get update
      sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
      ```
    - (Optional) BuildKit/Buildx for advanced builds:
      ```bash
      sudo apt-get install docker-buildx-plugin
      ```
  - **Linux (Kali Linux):**
    - Install Docker from the official repo (recommended).
    - Install **Docker Compose v2** plugin:
      ```bash
      sudo apt update
      sudo apt install -y docker.io docker-compose
      sudo systemctl enable docker --now
      sudo usermod -aG docker $USER
      newgrp docker
      ```
  - **Windows 10/11:** Install **Docker Desktop** (includes Compose v2).
  - **macOS (Intel/Apple Silicon):** Install **Docker Desktop** (includes Compose v2).

- **Internet access** (first run pulls images).

### System resources (guidelines)
- **If you run only the dev MERN stack** (frontend+backend+Mongo):
  - RAM: ~2–3 GB free
  - Disk: ~1–2 GB for images + volumes
- **If you also run CI stack** (Jenkins + SonarQube + Postgres):
  - RAM: **~6–8 GB free** recommended (SonarQube is memory-hungry)
  - Disk: +3–5 GB for images + data
  - CPU: 2+ cores recommended

### Network & ports (default)
- Frontend (React): **http://localhost:3000**
- Backend (Express API): **http://localhost:5000**
- Jenkins: **http://localhost:8080**
- SonarQube: **http://localhost:9000**
- MongoDB is internal to Docker (service name `mern_mongo:27017`).

> If ports are in use, adjust them in `infra/docker-compose.*.yml`.

---

## 🚫 What you do NOT need
- You **do not** need Node.js or npm on your host for normal usage.
- You **do not** need a local MongoDB installation.

> If you *do* want reproducible `npm ci` installs, see **Lockfiles** below.

---

## Quick Start

### Run the app locally (dev stack)
```bash
docker compose -f infra/docker-compose.dev.yml up -d --build
```
Open:
- Frontend: http://localhost:3000
- API: http://localhost:5000

Stop & clean:
```bash
docker compose -f infra/docker-compose.dev.yml down -v
```

### Run CI/Quality stack
```bash
docker compose -f infra/docker-compose.ci.yml up -d
```
Open:
- Jenkins: http://localhost:8080
- SonarQube: http://localhost:9000

Stop & clean:
```bash
docker compose -f infra/docker-compose.ci.yml down -v
```

---

## Lockfiles (`npm install` vs `npm ci`)

This repo intentionally **does not commit `package-lock.json`**. To keep the container-only workflow simple and avoid extra host tooling, the Dockerfiles use:
```bash
npm install --omit=dev
```
This avoids the `npm ci` lockfile requirement and “just works” in clean environments.

Prefer reproducible builds with `npm ci`? Generate lockfiles and switch back:
```bash
cd backend && npm i --package-lock-only && cd ..
cd frontend && npm i --package-lock-only && cd ..
# Then in both Dockerfiles replace:
#   npm install --omit=dev
# with:
#   npm ci --omit=dev
```
Commit the lockfiles and rebuild.

---

## Common issues & fixes

- **Warning:** `the attribute 'version' is obsolete`  
  → We’ve removed `version:` from compose files (Compose v2 ignores it).

- **Warning:** `Compose is configured to build using Bake, but buildx isn't installed`  
  → Optional. Install Buildx plugin or ignore; builds work with the default builder.

- **Permission error connecting to Docker daemon**  
  ```bash
  sudo usermod -aG docker $USER
  newgrp docker
  ```

- **Ports already in use**  
  → Change `ports:` in `infra/docker-compose.*.yml`.

---

## What’s in each stack?

- **Dev stack (`infra/docker-compose.dev.yml`)**  
  - `mern_frontend` (React dev server)  
  - `mern_backend` (Express API)  
  - `mern_mongo` (MongoDB)

- **CI stack (`infra/docker-compose.ci.yml`)**  
  - `jenkins` (pipelines)  
  - `sonarqube` + `postgres` (code quality & DB)
