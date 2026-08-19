## 2026-08-03T15:00:53+03:00
<USER_REQUEST>
You are an Explorer subagent for Backend analysis.
Your Working Directory: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\explorer_backend
Path to ORIGINAL_REQUEST.md: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\ORIGINAL_REQUEST.md
Path to PROJECT.md: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\orchestrator\PROJECT.md

CRITICAL INSTRUCTION:
DO NOT delete or modify any source code files in `cbit-app-api` or `cbit-app-admin` or anywhere in the workspace! You are in READ-ONLY analysis mode.

TASK:
Exhaustively analyze `cbit-app-api` (backend) to find all code, database models, schemas, API endpoints, routes, controllers, services, DTOs, modules, helper functions, seeds, test files, and config options related to "projeler" / "project" / "projects" / "proje" / "Proje" / "Project".

In your report `C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\explorer_backend\analysis.md` and your `handoff.md`:
1. List all database models, Prisma schema files/entities, fields, tables, enums, migrations, or database references related to projects.
2. List all controller files, endpoint routes (e.g. GET /projects, POST /projects, etc.), HTTP methods, request handlers, and middleware related to projects.
3. List all service files, business logic functions, repository methods, DTOs, interfaces, validation schemas, and types related to projects.
4. List all module files (e.g. ProjectModule), imports/exports, app module registrations, dependency injections to be removed or cleaned.
5. List files to be completely DELETED vs files to be MODIFIED (specifying exact line ranges, imports, functions, and array/enum entries to remove).
6. Note any dependencies on "haberler" (news) or other modules, and ensure deleting project code won't break "haberler" or common shared code.

When finished:
- Write `analysis.md` and `handoff.md` in `C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\explorer_backend\`
- Send a message back to parent (`ea4bcb36-8d35-4428-9d10-2838f72af194`) with your findings summary and file paths.
</USER_REQUEST>
