# SCAR TISSUE LEDGER (Lessons Learned)

**Entry 028: The 404 Model Registry Ghost**
*   **Symptom:** Backend threw 404 when calling `gemini-3.0-pro`.
*   **Lesson:** Never assume upcoming model IDs. **Always verify against the Vertex AI registry.** Reverted to `gemini-2.5-pro` (stable) and `gemini-2.0-flash-001`.

**Entry 029: The Silent Uvicorn Buffer**
*   **Symptom:** `print()` logs were invisible in the terminal.
*   **Fix:** Use `logging.getLogger("uvicorn.error")`. It forces logs to terminal immediately.

**Entry 030: The Schema Leak (Self-Talk)**
*   **Symptom:** LLM put its internal reasoning ("I have analyzed the request...") into the user chat bubble.
*   **Fix:** Strictly separate `user_message` (social) from `thought_process` (internal) in Pydantic schemas. Use "Negative Constraints" in prompts: "NO META-TALK."

**Entry 031: The 422 Handshake Error**
*   **Symptom:** Frontend fetch fails with "Unprocessable Entity."
*   **Fix:** Ensure FastAPI parameters (Form vs Body) match exactly between Frontend `FormData` and Backend endpoint signatures.

**Entry 032: The Truncation Trap (Merging Logic)**
*   **Symptom:** Refactoring major UI components led to 200+ lines of specialized visual logic being deleted, breaking all layers except the one being worked on.
*   **Fix:** Never "lean out" the page logic during a refactor. Always merge new architectural changes into the existing production code to preserve resizable frames and custom node types. Use explicit typing (e.g. `DeptSlot`) to satisfy the TS compiler during ledger-to-node mapping.



**Entry 033: The Truncation Trap**
*   **Symptom:** Refactoring major UI components led to 200+ lines of visual logic being deleted.
*   **Fix:** Never "lean out" production files during a refactor. Always merge new logic into the existing production code.

**Entry 034: The Middleware Gate**
*   **Symptom:** Production Handshake failed with "Access-Control-Allow-Origin" errors.
*   **Fix:** CORSMiddleware must be added **before** routes are mounted. Use `allow_origins=["*"]` for Cloud Run MVPs to handle shifting service URLs.

**Entry 035: Baked Config (Docker Build Args)**
*   **Symptom:** Local frontend talking to Cloud backend or vice-versa.
*   **Fix:** Next.js environment variables must be passed as `--build-arg` during the Docker build process, as they are baked at build-time.