# Nginx Proxy Configurations Investigation Report

## Executive Summary

An investigation of the Nginx configuration files in both `cbit-app-web` and `cbit-app-admin` was performed. Both frontend applications use an identical custom `nginx.conf` file, which is copied into the Nginx Alpine container as `/etc/nginx/conf.d/default.conf` during Docker image builds. 

Both applications route API requests through a `/api/` proxy route and uploaded assets through a `/uploads/` proxy route, forwarding both directly to the backend Docker service container `http://cbit-app-api:4101/`. No explicit Nginx `upstream` blocks are defined.

---

## 1. Discovered Nginx Configuration Files

| Project | File Path | Destination in Docker Image |
| :--- | :--- | :--- |
| `cbit-app-web` | `cbit/cbit-app-web/nginx.conf` | `/etc/nginx/conf.d/default.conf` (via `Dockerfile:25`) |
| `cbit-app-admin` | `cbit/cbit-app-admin/nginx.conf` | `/etc/nginx/conf.d/default.conf` (via `Dockerfile:25`) |

---

## 2. Detailed Proxy Directives & Line Numbers

### 2.1. `cbit-app-web/nginx.conf`

File path: `cbit/cbit-app-web/nginx.conf`

```nginx
1: server {
2:     listen 80;
3:     server_name localhost;
4: 
5:     location / {
6:         root /usr/share/nginx/html;
7:         index index.html index.htm;
8:         try_files $uri $uri/ /index.html;
9:     }
10: 
11:     # Proxy API requests starting with /api to backend service cbit-app-api
12:     location /api/ {
13:         proxy_pass http://cbit-app-api:4101/;
14:         proxy_http_version 1.1;
15:         proxy_set_header Upgrade $http_upgrade;
16:         proxy_set_header Connection 'upgrade';
17:         proxy_set_header Host $host;
18:         proxy_cache_bypass $http_upgrade;
19: 
20:         proxy_set_header X-Real-IP $remote_addr;
21:         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
22:         proxy_set_header X-Forwarded-Proto $scheme;
23:     }
24: 
25:     # Proxy uploaded static files to backend service cbit-app-api
26:     location /uploads/ {
27:         proxy_pass http://cbit-app-api:4101/uploads/;
28:         proxy_http_version 1.1;
29:         proxy_set_header Host $host;
30:         proxy_set_header X-Real-IP $remote_addr;
31:         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
32:         proxy_set_header X-Forwarded-Proto $scheme;
33:     }
34: 
35:     error_page 500 502 503 504 /50x.html;
36:     location = /50x.html {
37:         root /usr/share/nginx/html;
38:     }
39: }
```

#### Directive Summary for `cbit-app-web`:
* **Route `/api/` (Line 12)**:
  * Line 13: `proxy_pass http://cbit-app-api:4101/;`
  * Target: Docker service `cbit-app-api` on port `4101`.
  * Note on path rewriting: Because the URI in `proxy_pass` has a trailing slash (`/`), Nginx strips the matching `/api/` prefix. Request `GET /api/v1/news` becomes `GET /v1/news` when sent to `cbit-app-api:4101`.
* **Route `/uploads/` (Line 26)**:
  * Line 27: `proxy_pass http://cbit-app-api:4101/uploads/;`
  * Target: Docker service `cbit-app-api` on port `4101` under path `/uploads/`.
* **Route `/` (Line 5)**:
  * Serves Single Page Application static files from `/usr/share/nginx/html` with fallback `try_files $uri $uri/ /index.html;`.

---

### 2.2. `cbit-app-admin/nginx.conf`

File path: `cbit/cbit-app-admin/nginx.conf`

```nginx
1: server {
2:     listen 80;
3:     server_name localhost;
4: 
5:     location / {
6:         root /usr/share/nginx/html;
7:         index index.html index.htm;
8:         try_files $uri $uri/ /index.html;
9:     }
10: 
11:     # Proxy API requests starting with /api to backend service cbit-app-api
12:     location /api/ {
13:         proxy_pass http://cbit-app-api:4101/;
14:         proxy_http_version 1.1;
15:         proxy_set_header Upgrade $http_upgrade;
16:         proxy_set_header Connection 'upgrade';
17:         proxy_set_header Host $host;
18:         proxy_cache_bypass $http_upgrade;
19: 
20:         proxy_set_header X-Real-IP $remote_addr;
21:         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
22:         proxy_set_header X-Forwarded-Proto $scheme;
23:     }
24: 
25:     # Proxy uploaded static files to backend service cbit-app-api
26:     location /uploads/ {
27:         proxy_pass http://cbit-app-api:4101/uploads/;
28:         proxy_http_version 1.1;
29:         proxy_set_header Host $host;
30:         proxy_set_header X-Real-IP $remote_addr;
31:         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
32:         proxy_set_header X-Forwarded-Proto $scheme;
33:     }
34: 
35:     error_page 500 502 503 504 /50x.html;
36:     location = /50x.html {
37:         root /usr/share/nginx/html;
38:     }
39: }
```

#### Directive Summary for `cbit-app-admin`:
* Configuration content is identical to `cbit-app-web/nginx.conf`.
* **Route `/api/` (Line 12)**: `proxy_pass http://cbit-app-api:4101/;` (Line 13)
* **Route `/uploads/` (Line 26)**: `proxy_pass http://cbit-app-api:4101/uploads/;` (Line 27)

---

## 3. Upstream Servers and Hardcoded Hostnames / Ports

1. **Upstream Blocks**:
   * Neither `cbit-app-web/nginx.conf` nor `cbit-app-admin/nginx.conf` uses explicit Nginx `upstream` block declarations.
2. **Hardcoded Backend Hostnames & Ports**:
   * **Hostname**: `cbit-app-api`
   * **Port**: `4101`
   * Full Target URL for API: `http://cbit-app-api:4101/`
   * Full Target URL for Uploads: `http://cbit-app-api:4101/uploads/`
3. **Docker Network Context**:
   * In `docker-compose.yml` (both at root level and inside `cbit/`), `cbit-app-api`, `cbit-app-web`, and `cbit-app-admin` are connected via `cbit-network` (bridge network driver).
   * Docker DNS resolves the hostname `cbit-app-api` to the container IP of `cbit-app-api`.

---

## 4. Build Environment & Frontend Integration

* In both `cbit-app-web/Dockerfile` (Line 16) and `cbit-app-admin/Dockerfile` (Line 16), the environment variable `VITE_API_URL=/api` is set at build time (`ENV VITE_API_URL=/api`).
* In `src/api/client.ts` for both applications:
  * Fallback when not set in env is `http://localhost:4101`.
  * When built inside Docker, `VITE_API_URL` resolves to `/api`.
  * Frontend API calls (e.g. `/v1/projects/our-projects`) send requests to `/api/v1/projects/our-projects`.
  * Nginx receives `/api/v1/projects/our-projects`, strips `/api/`, and proxies to `http://cbit-app-api:4101/v1/projects/our-projects`.
