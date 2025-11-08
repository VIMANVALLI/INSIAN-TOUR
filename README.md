# Indian Tourism - Example Project (React + FastAPI)

This scaffold contains a simple React frontend and a FastAPI backend demonstrating:
- Home page with a sidebar (states, add place, profile)
- Simple state buttons on a map area to filter places
- Signup / Login with profile photo upload (0-2MB)
- Add place with name, state, description, photo uploads (0-2MB per file)
- Backend CRUD APIs for places

## Run backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

## Run frontend (development)
```bash
cd frontend
npm install
npm start
```

Backend stores uploads in `backend/uploads` and uses a simple sqlite DB at `backend/app.db`.

This is a starting scaffold. Improve authentication, validation, and UI as needed.
