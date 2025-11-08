## Quick context

- Backend: FastAPI app at `backend/app.py`. Key endpoints: `/signup`, `/login`, `/places` (POST/GET/PUT/DELETE), and `/uploads/{filename}` for serving uploaded files.
- Frontend: React in `frontend/` (entry `frontend/src/index.js`, main `frontend/src/App.js`). The app uses local component state for navigation (no React Router).
- Data stores: simple SQLite at `backend/app.db`. File uploads are stored under `backend/uploads`.

## What matters for code edits

- Authentication is token-based but minimal: the backend stores `User.token` and expects a form field named `token` for protected endpoints (e.g. creating/updating/deleting places). See `get_user_by_token` in `backend/app.py`.
- File uploads are handled via HTML multipart/form-data with a 2MB per-file limit enforced in the backend. Filenames use `uuid.hex + '_' + original_filename` and are saved to `backend/uploads`.
- Places' photos are stored as a stringified Python list in `Place.photos` (e.g. str([...])) and the backend reads it back with `eval()` — be cautious when modifying this format. If you change this to JSON, update all places where `eval` is used (list_places, get_place, update_place).

## How to run (developer workflows)

- Backend (development):
  - Create/activate a virtualenv in `backend/`.
  - Install: `pip install -r requirements.txt` (see `backend/requirements.txt`).
  - Run: `uvicorn app:app --reload --host 0.0.0.0 --port 8000` (the code expects `app` to expose FastAPI instance named `app`).
- Frontend (development):
  - From `frontend/`: `npm install` then `npm start` (dev server on localhost:3000).
- CORS: backend allows `http://localhost:3000` (see CORSMiddleware in `backend/app.py`).

## Project-specific patterns and conventions

- No centralized router on frontend: navigation is an app-level `view` state in `frontend/src/App.js`. When changing UI, adjust how components are mounted (Home, States, AddPlace, Login, Signup) instead of changing React Router.
- Form uploads: frontend components use FormData + multipart to send files and the `token` field. Keep using `token` as a form field for compatibility.
- Inline styles are used frequently (see `App.js`). Small UI changes are typically implemented inline rather than adding separate CSS modules.
- Database migrations are not present. `backend/app.py` uses SQLAlchemy and creates tables on startup with `Base.metadata.create_all`. Be careful: schema changes will require manual migration or a migration tool (Alembic) if you want to preserve data.

## Integration points & external deps to know

- `backend/requirements.txt` includes: fastapi, uvicorn, python-multipart, passlib[bcrypt], sqlalchemy, pydantic, aiofiles, python-dotenv. These are the main libs you will touch for API/auth/uploads.
- Frontend expects API at `http://localhost:8000`. Endpoints used by frontend: `/signup`, `/login`, `/places`, `/uploads/<filename>`.

## Examples from the codebase (use these as references)

- Auth flow: signup in `backend/app.py` assigns `user.token = uuid.uuid4().hex` and returns it. Frontend persists token to `localStorage` in `frontend/src/App.js`.
- Upload handling: `create_place` reads `files: list[UploadFile]`, enforces 2MB size and writes files to `backend/uploads`.
- Serving files: `GET /uploads/{filename}` returns a `FileResponse` for the saved file.

## Safe-change guidance (do this first)

1. Read `backend/app.py` to understand the simple auth and storage patterns before modifying any endpoint behavior.
2. If you change the `Place.photos` serialization, update all endpoints that read/write `p.photos` and the frontend shape expectations.
3. For UI changes, search `frontend/src` for components — there is no router; changes are often local to mounted components.

## When to ask the repo owner

- If you plan to change auth (e.g., switch to JWT or header-based tokens) — confirm how the frontend should send tokens (current flow uses form fields).
- If you plan to change uploads storage (S3 vs. local) — ask whether to migrate existing filenames and how to map `Place.photos`.

---
If you'd like, I can: update any endpoint to accept Authorization headers instead of form tokens, convert `Place.photos` to JSON safely, or add a tiny README in `backend/` with exact dev commands; tell me which and I'll implement it.
