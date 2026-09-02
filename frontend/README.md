# Smrithi — Frontend Application

React web application for SMRITHI featuring Patient View, Caregiver View, cognitive games, memory albums, and daily routines.

## Prerequisites

- Node.js 18.0+
- `npm` (Node package manager)

## Installation & Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration (Optional):**
   - Create a `.env` file in the `frontend` root:
     ```env
     VITE_API_BASE_URL=http://localhost:8000
     ```

## Running the Application

### Development Mode

Start the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Production Build

Build the production-ready bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run code quality and linter checks:

```bash
npm run lint
```
