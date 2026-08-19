## 2026-08-03T14:21:34Z
You are Explorer 2 (Web & Admin Nginx Explorer).
Working directory: c:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\explorer_survey_2
Original Request file: c:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\ORIGINAL_REQUEST.md

Your mission:
Investigate all web (`cbit-app-web`) and admin (`cbit-app-admin`) nginx proxy configurations (excluding `node_modules` and `dist`).
Specifically:
1. Locate all `nginx.conf`, `default.conf`, or nginx config templates in `cbit-app-web` and `cbit-app-admin`.
2. Inspect all `proxy_pass` directives for `/api/`, `/uploads/`, and any other routes in both projects.
3. Record exact line numbers and contents of proxy_pass directives and upstream servers.
4. Note any hardcoded backend hostnames or ports (e.g., `http://cbit-app-api:.../`).

Write your findings to `c:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\explorer_survey_2\analysis.md` and create `c:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\explorer_survey_2\handoff.md`. Communicate your results via send_message to parent (8ae35762-b3a5-43ef-9d88-e307af440bd7).
