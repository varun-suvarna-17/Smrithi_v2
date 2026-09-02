# Smrithi — Backend API

FastAPI backend service powering SMRITHI with multilingual voice synthesis, cognitive game telemetry, and patient/caregiver data management.

## Prerequisites

- Python 3.10+
- `pip` (Python package manager)

## Installation & Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   - **Linux / macOS:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - **Windows:**
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration:**
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Configure Firebase service account credentials in `.env` if Firestore persistence is needed.

## Running the Server

Start the FastAPI server with auto-reload:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend server runs at `http://localhost:8000`.
Interactive API docs are available at `http://localhost:8000/docs`.
