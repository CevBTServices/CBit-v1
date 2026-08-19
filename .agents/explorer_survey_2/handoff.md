# Explorer 2 Handoff Report — Web & Admin Nginx Proxy Configurations

## 1. Observation

### 1.1 Discovered Files
- **File 1**: `cbit/cbit-app-web/nginx.conf`
- **File 2**: `cbit/cbit-app-web/Dockerfile`
- **File 3**: `cbit/cbit-app-admin/nginx.conf`
- **File 4**: `cbit/cbit-app-admin/Dockerfile`
- **File 5**: `cbit/docker-compose.yml` (and `docker-compose.yml` at workspace root)

### 1.2 Verbatim Code Snippets

#### `cbit/cbit-app-web/nginx.conf` (Lines 11-33)
```nginx
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
```

#### `cbit/cbit-app-admin/nginx.conf` (Lines 11-33)
```nginx
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
```

#### Dockerfiles
- `cbit/cbit-app-web/Dockerfile:25`: `COPY nginx.conf /etc/nginx/conf.d/default.conf`
- `cbit/cbit-app-web/Dockerfile:16`: `ENV VITE_API_URL=/api`
- `cbit/cbit-app-admin/Dockerfile:25`: `COPY nginx.conf /etc/nginx/conf.d/default.conf`
- `cbit/cbit-app-admin/Dockerfile:16`: `ENV VITE_API_URL=/api`

---

## 2. Logic Chain

1. **Discovery**: `find_by_name` across `cbit-app-web` and `cbit-app-admin` identified `nginx.conf` in both subdirectories (Observed in `cbit/cbit-app-web/nginx.conf` and `cbit/cbit-app-admin/nginx.conf`).
2. **Configuration Inspection**:
   - Both `nginx.conf` files configure two `location` proxy blocks (`/api/` and `/uploads/`).
   - Line 13 in both files points `/api/` requests to `http://cbit-app-api:4101/`. The trailing slash causes Nginx to strip `/api/` before passing to `cbit-app-api`.
   - Line 27 in both files points `/uploads/` requests to `http://cbit-app-api:4101/uploads/`.
3. **Upstream & Hostname Analysis**:
   - Neither configuration uses an `upstream` block directive.
   - Both configurations hardcode the backend hostname `cbit-app-api` and port `4101`.
   - In `docker-compose.yml`, `cbit-app-api` is the service container name running on `cbit-network`.
4. **Client Mapping Integration**:
   - Both Dockerfiles inject `ENV VITE_API_URL=/api` during frontend build.
   - Vite builds API calls as relative requests to `/api/*`, which hit Nginx port 80 inside the container and get proxied via the `/api/` location block to `http://cbit-app-api:4101/`.

---

## 3. Caveats

- **No Standalone Reverse Proxy**: There is no top-level Nginx acting as a single entrypoint router for both apps on host ports; instead, each app runs its own Nginx container instance (web exposed on host 4100 -> container 80, admin exposed on host 4102 -> container 80).
- **Hardcoded Docker Service Names**: If the container name or service name of `cbit-app-api` changes in `docker-compose.yml`, or if the API port `4101` changes, both `nginx.conf` files must be updated manually.
- **Node Modules & Dist Excluded**: As instructed, built artifacts (`dist`) and dependencies (`node_modules`) were excluded from the search.

---

## 4. Conclusion

- Both `cbit-app-web` and `cbit-app-admin` utilize identical Nginx configuration patterns.
- Exact `proxy_pass` directives:
  - `/api/` -> `http://cbit-app-api:4101/` (Line 13 in both `nginx.conf` files)
  - `/uploads/` -> `http://cbit-app-api:4101/uploads/` (Line 27 in both `nginx.conf` files)
- Hardcoded backend hostname: `cbit-app-api`
- Hardcoded backend port: `4101`
- Upstream blocks: None declared.

---

## 5. Verification Method

To independently verify these findings:
1. Inspect `cbit/cbit-app-web/nginx.conf` at lines 12-33 using `view_file`.
2. Inspect `cbit/cbit-app-admin/nginx.conf` at lines 12-33 using `view_file`.
3. Inspect `cbit/docker-compose.yml` to confirm service names (`cbit-app-api`, `cbit-app-web`, `cbit-app-admin`) and container network binding (`cbit-network`).
4. Invalidation condition: If any `upstream` block exists or if `proxy_pass` targets a different host/port, this report would be invalidated.
