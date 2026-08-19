## 2026-08-03T12:05:56Z
You are Reviewer 1 subagent.
Your Working Directory: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\reviewer_1
Path to ORIGINAL_REQUEST.md: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\ORIGINAL_REQUEST.md
Path to PROJECT.md: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\orchestrator\PROJECT.md
Target Document to Review: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\cleanup_plan.md

TASK:
Perform a thorough review of `cleanup_plan.md`:
1. Verify that `cleanup_plan.md` is written in clear, professional Turkish.
2. Verify that all backend (`cbit-app-api`) files to be deleted and modified are concrete and accurately listed with exact line ranges and imports/functions.
3. Verify that all frontend (`cbit-app-admin`) files to be deleted and modified are concrete and accurately listed.
4. Verify that DB model changes (`schema.prisma`) and Prisma generate steps are documented.
5. Verify that "Haberler" (news) module independence and media upload preservation are explicitly detailed.
6. Verify that NO source code files in `cbit-app-api` or `cbit-app-admin` were modified or deleted.

When finished:
- Write `handoff.md` in `C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\reviewer_1\` with your verdict (`APPROVE` or `REQUEST_CHANGES`).
- Send a message to parent (`ea4bcb36-8d35-4428-9d10-2838f72af194`) with your review findings and verdict.
