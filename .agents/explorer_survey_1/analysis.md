# Backend & Admin Environment & Port Investigation Analysis

## Executive Summary
This report presents all discovered environment files, environment variables, configuration files, source code references, Dockerfiles, and Docker Compose configurations relevant to `cbit-app-api` (Backend) and `cbit-app-admin` (Admin). Currently, the backend runs on port `4101` and the admin dev server runs on port `4102` (mapped to port 80 in Docker). To fulfill requirements R1 and R3 (updating backend port to 2000 and admin frontend configuration), specific line-by-line updates must be performed.

---

## 1. Environment Files Inventory
Search for `.env`, `.env.example`, `.env.production`, or other environment files in root and project subdirectories yielded the following:

| Path | File | Status | Current Content / Key Port Settings |
|---|---|---|---|
| `cbit/cbit-app-api/.env` | Found | Existing | `PORT=4101`<br>`CORS_ORIGIN = http://localhost:5173,http://localhost:5174,http://localhost:4102` |
| `cbit/cbit-app-api/.env.example` | Found | Existing | `PORT=4101` |
| `cbit/cbit-app-admin/.env` | Found | Existing | `VITE_API_URL=http://localhost:4101` |
| `cbit/cbit-app-web/.env` | Found | Existing | `VITE_API_URL=/api` |
| `docker-compose.yml` (Root & `cbit/`) | Found | Existing | Container env_file points to `./cbit/cbit-app-api/.env` & `./cbit-app-api/.env` |

---

## 2. Detailed Port References (R1 & R3 Scope)

### A. Backend Service (`cbit-app-api`)

1. **`cbit/cbit-app-api/.env`**
   - **Line 2**: `PORT=4101`
   - **Line 7**: `CORS_ORIGIN = http://localhost:5173,http://localhost:5174,http://localhost:4102`

2. **`cbit/cbit-app-api/.env.example`**
   - **Line 3**: `PORT=4101`

3. **`cbit/cbit-app-api/src/libs/server.ts`**
   - **Line 18**: `const { PORT, NODE_ENV, CORS_ORIGIN } = process.env;`
   - **Line 20**: `if (!PORT) throw new Error('PORT tanımlı değil');`
   - **Line 26**: `    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:4102'];`
   - **Line 113**: `    app.listen(Number(PORT), host, () => {`
   - **Line 114**: `      logger.info(\`[EXPRESS APP]\tSuccessfully opened on http://${host}:${PORT}\`);`

4. **`cbit/cbit-app-api/Dockerfile`**
   - **Line 45**: `EXPOSE 4101`

---

### B. Admin Service (`cbit-app-admin`)

1. **`cbit/cbit-app-admin/.env`**
   - **Line 1**: `VITE_API_URL=http://localhost:4101`

2. **`cbit/cbit-app-admin/nginx.conf`**
   - **Line 13**: `        proxy_pass http://cbit-app-api:4101/;`
   - **Line 27**: `        proxy_pass http://cbit-app-api:4101/uploads/;`

3. **`cbit/cbit-app-admin/vite.config.ts`**
   - **Line 8**: `    port: 4102,`
   - **Line 11**: `        target: "http://127.0.0.1:4101",`

4. **`cbit/cbit-app-admin/src/api/client.ts`**
   - **Line 3**: `const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4101";`

5. **`cbit/cbit-app-admin/Dockerfile`**
   - **Line 30**: `# Expose port 80 (will be mapped to 4102 on host)`

---

### C. Docker Compose Configuration (`docker-compose.yml`)

1. **`docker-compose.yml` (Root)**
   - **Line 9**: `      - "4101:4101"` (`cbit-app-api` port binding)
   - **Line 24**: `      - "4102:80"` (`cbit-app-admin` port binding)

2. **`cbit/docker-compose.yml`**
   - **Line 9**: `      - "4101:4101"` (`cbit-app-api` port binding)
   - **Line 24**: `      - "4102:80"` (`cbit-app-admin` port binding)

---

## 3. Recommended Actions for Implementation

To complete **R1 (Backend Port Update to 2000)** and **R3 (Admin Port Update & Nginx Proxy to 2000)**:
1. In `cbit/cbit-app-api/.env`, update `PORT=4101` to `PORT=2000`.
2. In `cbit/cbit-app-api/.env.example`, update `PORT=4101` to `PORT=2000`.
3. In `cbit/cbit-app-api/Dockerfile`, update `EXPOSE 4101` to `EXPOSE 2000`.
4. In `cbit/cbit-app-admin/.env`, update `VITE_API_URL=http://localhost:4101` to `VITE_API_URL=http://localhost:2000`.
5. In `cbit/cbit-app-admin/nginx.conf`, update `proxy_pass http://cbit-app-api:4101/;` and `http://cbit-app-api:4101/uploads/;` to `http://cbit-app-api:2000/` and `http://cbit-app-api:2000/uploads/`.
6. In `cbit/cbit-app-admin/vite.config.ts`, update proxy target `http://127.0.0.1:4101` to `http://127.0.0.1:2000`.
7. In `cbit/cbit-app-admin/src/api/client.ts`, update fallback `http://localhost:4101` to `http://localhost:2000`.
