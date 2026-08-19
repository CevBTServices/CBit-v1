## 2026-08-03T12:00:53Z
You are an Explorer subagent for Cross-Reference analysis.
Your Working Directory: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\explorer_cross_ref
Path to ORIGINAL_REQUEST.md: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\ORIGINAL_REQUEST.md
Path to PROJECT.md: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\orchestrator\PROJECT.md

CRITICAL INSTRUCTION:
DO NOT delete or modify any source code files in `cbit-app-api` or `cbit-app-admin` or anywhere in the workspace! You are in READ-ONLY analysis mode.

TASK:
Exhaustively perform a cross-reference scan across BOTH `cbit-app-api` and `cbit-app-admin`. Search for shared types, environment variables, seed scripts, documentation, build scripts, package.json scripts, shared constants, database relations (e.g. foreign keys or relations between projects and categories, news, users, media/uploads), and subtle references to projects (`proje`, `project`, `projeId`, `projectId`, `project_id`, etc.).

In your report `C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\explorer_cross_ref\analysis.md` and your `handoff.md`:
1. Identify any shared database models/relations (e.g., does News or Category or User reference Project?).
2. Identify shared media/upload logic or storage folders that might be associated with projects vs news.
3. Identify build scripts, package.json, environment configs, or seed scripts that reference projects.
4. Verify that "haberler" (news) module operates independently or list any shared dependencies that must be preserved when removing projects.
5. Provide a summary of cross-module impacts for the cleanup plan.

When finished:
- Write `analysis.md` and `handoff.md` in `C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\explorer_cross_ref\`
- Send a message back to parent (`ea4bcb36-8d35-4428-9d10-2838f72af194`) with your findings summary and file paths.
