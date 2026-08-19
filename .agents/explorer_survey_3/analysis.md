# Docker Compose & Root Structure Analysis Report

**Explorer**: Explorer 3 (Docker Compose & Root Structure Explorer)  
**Date**: 2026-08-03  
**Workspace**: `c:\Users\ahmet.altun\Desktop\WorkSpace\cbit`  

---

## Executive Summary

A comprehensive scan of the workspace was conducted to locate all Docker Compose files and analyze port mappings, container configurations, and the overall folder structure of all microservice components. 

Key Findings:
1. **Docker Compose Files**: Exactly **3** `docker-compose.yml` files exist across the project (Root, `cbit/`, and `cbit-hazirlanma/`). No `.override.yml` or `.dev.yml` files were found.
2. **Port Mappings**:
   - `cbit-app-web`: Host port **4100** mapped to container port **80**
   - `cbit-app-api`: Host port **4101** mapped to container port **4101**
   - `cbit-app-admin`: Host port **4102** mapped to container port **80**
   - `cbit-hazirlanma` (`cbit-web`): Host port **5000** mapped to container port **80**
3. **Microservices Structure**: The main application stack is housed inside `cbit/` comprising three distinct microservices (`cbit-app-api`, `cbit-app-admin`, `cbit-app-web`), alongside standalone modules `cbit-hazirlanma/`, `cbit-website/`, and `content/`.

---

## 1. Docker Compose Files & Port Mappings

### 1.1 Root `docker-compose.yml`
- **File Path**: `c:\Users\ahmet.altun\Desktop\WorkSpace\cbit\docker-compose.yml`
- **Relative Path**: `docker-compose.yml`
- **Total Lines**: 50
- **Purpose**: Root orchestrator compose file for the entire CBIT application suite.

#### Service Specifications:

1. **Service**: `cbit-app-api`
   - **Line Numbers**: Lines 2 – 15
   - **Build Context**: `./cbit/cbit-app-api` (Line 4)
   - **Dockerfile**: `Dockerfile` (Line 5)
   - **Container Name**: `cbit-app-api` (Line 6)
   - **Restart Policy**: `unless-stopped` (Line 7)
   - **Port Mapping**:
     ```yaml
     8:     ports:
     9:       - "4101:4101"
     ```
     - **Host Port**: `4101`
     - **Container Port**: `4101`
   - **Env File**: `./cbit/cbit-app-api/.env` (Line 11)
   - **Volume Mount**: `cbit_uploads:/app/uploads` (Line 13)
   - **Network**: `cbit-network` (Line 15)

2. **Service**: `cbit-app-admin`
   - **Line Numbers**: Lines 17 – 28
   - **Build Context**: `./cbit/cbit-app-admin` (Line 19)
   - **Dockerfile**: `Dockerfile` (Line 20)
   - **Container Name**: `cbit-app-admin` (Line 21)
   - **Restart Policy**: `unless-stopped` (Line 22)
   - **Port Mapping**:
     ```yaml
     23:     ports:
     24:       - "4102:80"
     ```
     - **Host Port**: `4102`
     - **Container Port**: `80`
   - **Dependencies**: `cbit-app-api` (Line 26)
   - **Network**: `cbit-network` (Line 28)

3. **Service**: `cbit-app-web`
   - **Line Numbers**: Lines 30 – 41
   - **Build Context**: `./cbit/cbit-app-web` (Line 32)
   - **Dockerfile**: `Dockerfile` (Line 33)
   - **Container Name**: `cbit-app-web` (Line 34)
   - **Restart Policy**: `unless-stopped` (Line 35)
   - **Port Mapping**:
     ```yaml
     36:     ports:
     37:       - "4100:80"
     ```
     - **Host Port**: `4100`
     - **Container Port**: `80`
   - **Dependencies**: `cbit-app-api` (Line 39)
   - **Network**: `cbit-network` (Line 41)

#### Shared Resources:
- **Volume**: `cbit_uploads` (driver: local, Lines 44–45)
- **Network**: `cbit-network` (driver: bridge, Lines 48–49)

---

### 1.2 Subdirectory `cbit/docker-compose.yml`
- **File Path**: `c:\Users\ahmet.altun\Desktop\WorkSpace\cbit\cbit\docker-compose.yml`
- **Relative Path**: `cbit/docker-compose.yml`
- **Total Lines**: 50
- **Purpose**: Local compose orchestrator scoped inside the `cbit/` directory. Identical service definitions with updated relative build contexts.

#### Service Specifications:

1. **Service**: `cbit-app-api`
   - **Line Numbers**: Lines 2 – 15
   - **Build Context**: `./cbit-app-api` (Line 4)
   - **Dockerfile**: `Dockerfile` (Line 5)
   - **Container Name**: `cbit-app-api` (Line 6)
   - **Port Mapping**:
     ```yaml
     8:     ports:
     9:       - "4101:4101"
     ```
     - **Host Port**: `4101`
     - **Container Port**: `4101`
   - **Env File**: `./cbit-app-api/.env` (Line 11)

2. **Service**: `cbit-app-admin`
   - **Line Numbers**: Lines 17 – 28
   - **Build Context**: `./cbit-app-admin` (Line 19)
   - **Dockerfile**: `Dockerfile` (Line 20)
   - **Container Name**: `cbit-app-admin` (Line 21)
   - **Port Mapping**:
     ```yaml
     23:     ports:
     24:       - "4102:80"
     ```
     - **Host Port**: `4102`
     - **Container Port**: `80`

3. **Service**: `cbit-app-web`
   - **Line Numbers**: Lines 30 – 41
   - **Build Context**: `./cbit-app-web` (Line 32)
   - **Dockerfile**: `Dockerfile` (Line 33)
   - **Container Name**: `cbit-app-web` (Line 34)
   - **Port Mapping**:
     ```yaml
     36:     ports:
     37:       - "4100:80"
     ```
     - **Host Port**: `4100`
     - **Container Port**: `80`

---

### 1.3 Subdirectory `cbit-hazirlanma/docker-compose.yml`
- **File Path**: `c:\Users\ahmet.altun\Desktop\WorkSpace\cbit\cbit-hazirlanma\docker-compose.yml`
- **Relative Path**: `cbit-hazirlanma/docker-compose.yml`
- **Total Lines**: 8
- **Purpose**: Standalone holding/maintenance page container setup.

#### Service Specifications:

1. **Service**: `cbit-web`
   - **Line Numbers**: Lines 2 – 7
   - **Build Context**: `.` (Line 3)
   - **Container Name**: `cbit_app` (Line 4)
   - **Restart Policy**: `always` (Line 7)
   - **Port Mapping**:
     ```yaml
     5:     ports:
     6:       - "5000:80"
     ```
     - **Host Port**: `5000`
     - **Container Port**: `80`

---

## 2. Port Mappings Summary Table

| Service Name | Docker Compose File Location | Line Numbers | Host Port | Container Port | Exposed Port in Dockerfile |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cbit-app-web` | `docker-compose.yml` | Lines 36-37 | 4100 | 80 | EXPOSE 80 |
| `cbit-app-web` | `cbit/docker-compose.yml` | Lines 36-37 | 4100 | 80 | EXPOSE 80 |
| `cbit-app-api` | `docker-compose.yml` | Lines 8-9 | 4101 | 4101 | EXPOSE 4101 |
| `cbit-app-api` | `cbit/docker-compose.yml` | Lines 8-9 | 4101 | 4101 | EXPOSE 4101 |
| `cbit-app-admin` | `docker-compose.yml` | Lines 23-24 | 4102 | 80 | EXPOSE 80 |
| `cbit-app-admin` | `cbit/docker-compose.yml` | Lines 23-24 | 4102 | 80 | EXPOSE 80 |
| `cbit-web` | `cbit-hazirlanma/docker-compose.yml` | Lines 5-6 | 5000 | 80 | EXPOSE 80 |

---

## 3. Project Directory Structure & Microservice Relative Paths

### Workspace Root: `c:\Users\ahmet.altun\Desktop\WorkSpace\cbit`

```
cbit/
├── docker-compose.yml                      # Root Docker Compose orchestrator file
├── ORIGINAL_REQUEST.md                     # Initial survey request
├── cleanup_plan.md                         # Detailed module cleanup plan for "Projects"
├── cbit/                                   # Main Microservices Application Suite
│   ├── docker-compose.yml                  # Scoped Docker Compose file for cbit application
│   ├── cbit-app-api/                       # Microservice 1: Backend REST API
│   │   ├── Dockerfile                      # Node 22 Multi-stage build (Exposes 4101)
│   │   ├── package.json                    # API dependencies (Express, Prisma, Zod)
│   │   ├── prisma/                         # Prisma ORM schema & migrations
│   │   ├── keys/                           # Key files (JWT keys)
│   │   ├── src/                            # API Source code (controllers, routes, services)
│   │   └── uploads/                        # Uploaded media storage
│   ├── cbit-app-web/                       # Microservice 2: Frontend Web Application
│   │   ├── Dockerfile                      # Node 20 builder + Nginx image (Exposes 80)
│   │   ├── package.json                    # React + Vite dependencies
│   │   ├── nginx.conf                      # Nginx reverse proxy configuration
│   │   └── src/                            # React Web UI components & pages
│   └── cbit-app-admin/                     # Microservice 3: Frontend Admin Dashboard
│       ├── Dockerfile                      # Node 20 builder + Nginx image (Exposes 80)
│       ├── package.json                    # React + Vite admin dashboard
│       ├── nginx.conf                      # Nginx reverse proxy configuration
│       └── src/                            # React Admin UI components & pages
├── cbit-hazirlanma/                        # Standalone Landing Page Service
│   ├── docker-compose.yml                  # Docker Compose file (Port 5000:80)
│   ├── Dockerfile                      # Nginx alpine static host
│   ├── index.html                          # Maintenance / Coming Soon HTML page
│   ├── style.css                           # Styling for landing page
│   └── images/                             # Image assets for landing page
├── cbit-website/                           # Static HTML Corporate Website
│   ├── index.html                          # Corporate Homepage
│   ├── cozumler.html                       # Solutions page
│   ├── hakkimizda.html                     # About Us page
│   ├── iletisim.html                       # Contact page
│   ├── is-ortaklari.html                   # Partners page
│   ├── veri-merkezi.html                   # Data Center page
│   └── assets/                             # Static CSS/JS/images
├── content/                                # Content, Design Assets & Draft TSX Components
│   ├── *.png                               # High-res graphics & diagram assets
│   ├── *.tsx                               # React component drafts (Header, Hero, Solutions, etc.)
│   └── *.md                                # Content briefs & documentation
└── .agents/                                # Agent metadata directory
```

### Exact Relative Paths of Microservices & Components:

1. **`cbit/cbit-app-api`**: Backend Node.js / Express API microservice.
   - Entry point: `src/app.ts` / `src/server.ts`
   - Config / Environment: `.env`, `prisma/schema.prisma`
   - Port: `4101`

2. **`cbit/cbit-app-web`**: Public customer-facing Web frontend microservice.
   - Entry point: `index.html` / `src/main.tsx`
   - Web Server: Nginx (port 80 inside container, mapped to 4100 on host)
   - Port: `4100`

3. **`cbit/cbit-app-admin`**: Administrative control panel frontend microservice.
   - Entry point: `index.html` / `src/main.tsx`
   - Web Server: Nginx (port 80 inside container, mapped to 4102 on host)
   - Port: `4102`

4. **`cbit-hazirlanma`**: Holding page / maintenance static service.
   - Web Server: Nginx (port 80 inside container, mapped to 5000 on host)
   - Port: `5000`

5. **`cbit-website`**: Legacy or static marketing site containing static HTML pages.

6. **`content`**: Content repository containing React draft components, PNG diagrams, and text templates.

---

## 4. Observations & Notes

- **Redundancy**: `cbit/docker-compose.yml` and `docker-compose.yml` in root are functionally identical, with the root compose referencing `./cbit/cbit-app-*` context paths and the nested compose referencing `./cbit-app-*` context paths.
- **Service Isolation**: Each frontend application (`cbit-app-web` and `cbit-app-admin`) uses a multi-stage Dockerfile compiling React code and serving it via Nginx on port 80.
- **API Proxy**: Frontend Nginx configurations proxy requests under `/api` to the backend service `cbit-app-api:4101`.
