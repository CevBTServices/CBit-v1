# Execution Plan — CBIT Microservice Port Configuration Update

## Objective
Update microservice port configurations across the CBIT project:
- Backend (`cbit-app-api`): Port 2000
- Web (`cbit-app-web`): Port 1000 (proxying to `http://cbit-app-api:2000/`)
- Admin (`cbit-app-admin`): Port 500 (proxying to `http://cbit-app-api:2000/`)
- Docker Orchestration: `docker-compose.yml` external port mappings (`2000:2000`, `1000:80`, `500:80`)

## Phases
1. **Phase 0: Codebase Survey & Feature Inventory**
   - Dispatch 3 parallel Explorers to survey the repository (excluding `node_modules` and `dist`).
   - Identify all files referencing ports for backend, web, admin, and docker-compose.
   - Aggregate findings into `PROJECT.md § Feature Inventory` and `PROJECT.md § Code Layout`.

2. **Phase 1: Decomposition & Initializing Project Specification**
   - Formalize `PROJECT.md` with interface contracts, milestones, and verification rules.
   - Initialize `TEST_INFRA.md` for dual-track testing.

3. **Phase 2: Milestone Execution**
   - Milestone 1 (R1): Backend Port Update (`cbit-app-api`)
   - Milestone 2 (R2): Web Port Update (`cbit-app-web`)
   - Milestone 3 (R3): Admin Port Update (`cbit-app-admin`)
   - Milestone 4 (R4): Docker Orchestration Update (`docker-compose.yml`)

4. **Phase 3: Verification & Auditing**
   - Reviewers and Challengers verify config syntax and proxy target accuracy.
   - Forensic Auditor performs integrity verification across all files.

5. **Phase 4: Completion Report & Sentinel Handoff**
   - Produce final completion report and claim victory to Sentinel.
