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

**Entry 036: The Firestore Index Block**
*   **Symptom:** Listing projects failed with a 500 error when trying to sort by `is_pinned` and `updated_at`.
*   **Fix:** Firestore requires a manual composite index for multi-field sorting. Always check logs for the auto-generated index link.

**Entry 037: The Closure Staleness Trap**
*   **Symptom:** Cards disappearing during long AI requests.
*   **Fix:** In Zustand/Async functions, never rely on variables captured at the start of the function. Always use the functional update pattern: `set((state) => ({ ...state.data + newPatch }))` to ensure you merge with the absolute latest state.

**Entry 038: Manifest Type Sync**
*   **Symptom:** TS errors when saving state.
*   **Fix:** Ensure the `VibeManifest` interface (what we save) and `VibeStore` interface (what we use) are perfectly synchronized. Every property in the store must be explicitly accounted for in the Manifest contract.

# SCAR TISSUE LEDGER (Lessons Learned)

**Entry 040: The Appendix Mandate**
*   **Fix:** Harden the Pydantic schema to make the Appendix object mandatory. This forces the model to perform the research before validating the response.

**Entry 041: Async State ID Race**
*   **Symptom:** `Failed to Fetch: Store has no Project ID` error when sending messages immediately after project creation.
*   **Fix:** In `vibe-store.ts`, set the `project.id` synchronously at the very start of the hydration/creation logic. Never allow the ID to be null during an active session.

**Entry 042: Pure Setters (RPC Error)**
*   **Symptom:** "Failed to fetch" errors when putting `fetch()` calls inside a Zustand `set()` block.
*   **Fix:** Zustand setters must be pure. Move all autosave network calls outside of the `set()` function to prevent race conditions.

# SCAR TISSUE LEDGER (Lessons Learned)

**Entry 043: The Side-Effect RPC Error**
*   **Symptom:** "Failed to fetch" errors when putting `fetch()` calls inside a Zustand `set()` block.
*   **Fix:** Zustand setters must be pure. Move all autosave network calls outside of the `set()` function to prevent race conditions.

**Entry 044: Atomic Name Sync**
*   **Symptom:** UI Header remained "Untitled" even after the AI named the project.
*   **Fix:** Ensure the Frontend Store and the Backend Dispatcher perform a "Handshake" where `suggested_project_name` updates the local state and Firestore record in the same turn.

**Entry 045: Literal Role Enforcement**
*   **Symptom:** TS error: "Type 'string' is not assignable to type 'user' | 'assistant'".
*   **Fix:** Use `as const` when assigning role strings in TypeScript to satisfy strict literal type checks in the ChatMessage interface.


# SCAR_TISSUE_LEDGER

**Entry 046: The Graph Entrypoint Crash**
*   **Symptom:** Backend failed to start with `ValueError: Graph must have an entrypoint`.
*   **Fix:** LangGraph `StateGraph` cannot be compiled as an empty object. It requires at least one node, an edge from START, and an edge to END before `compile()` is called.

**Entry 047: The Alphabetical Layout Bug**
*   **Symptom:** Departments and Agents appearing in random order in the Lab UI.
*   **Fix:** Move away from `Object.keys()` mapping. Implement explicit `dept_index` and `role_index` fields in the database and use a hardcoded `DEPT_ORDER` array in the UI.

**Entry 048: Side-Effect RPC Errors**
*   **Symptom:** `Failed to fetch` error during project creation.
*   **Fix:** Autosave fetches must be triggered outside of the Zustand `set()` function. Functional updates `set((state) => ...)` must remain pure to avoid race conditions.

# SCAR TISSUE LEDGER (Lessons Learned)

**Entry 049: The Key Name Collision**
*   **Symptom:** Department Lenses disappeared from the Lab UI after a database update.
*   **Fix:** The seeder script changed the field name from `lens_profile` to `lens`. The "Dumb Code" in the UI was hardcoded to look for `lens_profile`. **Lesson:** Never change a database key name without updating the entire chain (Store + Backend + Seeder). Always use the full key name provided in the Types.