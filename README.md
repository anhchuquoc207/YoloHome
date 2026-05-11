# YoloHome

YoloHome is a smart home / AIoT dashboard composed of a React frontend and a NestJS backend. It is built to:

- authenticate and protect the admin interface
- monitor temperature and sensor history
- control room lights
- view the camera, recognize faces, and control the gate
- aggregate notifications from automatic light shutoff events and important camera events

This repository is a full-stack monorepo with two applications:

- `frontend/`: the web UI built with Vite + React
- `backend/`: the REST API built with NestJS + MongoDB + MQTT

## Main features

- `Authentication`
  - email/password sign-in
  - bearer token stored in `localStorage`
  - both frontend routes and backend APIs require authentication
- `Dashboard`
  - device overview
  - current temperature and trend summary
  - estimated power usage
  - notifications area
- `Lights`
  - room-by-room light control
  - persistent command history
  - distinction between `manual` and `auto` commands
- `Temperature`
  - current temperature reading
  - history and insights
  - backend still stores humidity and light intensity for MQTT compatibility
- `Camera`
  - live webcam preview in the browser
  - face recognition with `face-api.js`
  - `camera_on`, `camera_off`, and `face_detected` logs
  - gate opening for authorized recognition
- `Notifications`
  - notify when a light is turned off automatically
  - notify when the camera accepts a face
  - notify when the same face is denied more than 3 times

## High-level architecture

```text
Browser
  -> React UI
  -> TanStack Router + TanStack Query
  -> fetch API client
  -> NestJS REST API
  -> MongoDB

NestJS
  -> Mongoose repositories
  -> MQTT publisher / subscriber
  -> Device / camera / lights / temperature / power services

Camera flow
  -> webcam in browser
  -> face-api.js local recognition in frontend
  -> frontend calls POST /camera/recognize
  -> backend stores camera log + opens gate when authorized

Lighting flow
  -> frontend calls POST /lights/rooms/:room/command
  -> backend stores light command
  -> backend publishes MQTT to the mapped feed

Temperature flow
  -> backend subscribes to sensor data through MQTT
  -> stores readings in MongoDB
  -> frontend reads data through REST API
```

## Tech stack

### Frontend

| Layer | Technology |
| --- | --- |
| UI | React 19 + TypeScript |
| Build tool | Vite 8 |
| Routing | TanStack Router |
| Data fetching/cache | TanStack Query |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Webcam | react-webcam |
| Face recognition | face-api.js |

### Backend

| Layer | Technology |
| --- | --- |
| Framework | NestJS 11 |
| Database | MongoDB + Mongoose |
| Validation | class-validator + class-transformer |
| API docs | Swagger |
| Messaging | MQTT |
| Auth | HMAC-signed bearer token |

## Repository structure

```text
YOLOHOME/
|-- frontend/
|   |-- public/
|   |   |-- known_faces/               # Reference face images
|   |   `-- models/                    # face-api.js model files
|   |-- src/
|   |   |-- assets/                    # Images and icons
|   |   |-- components/
|   |   |   |-- auth/                  # Login screen
|   |   |   |-- camera/                # Camera page, preview, controls, event config
|   |   |   |-- dashboard/             # Dashboard cards, power, notifications
|   |   |   |-- forms/                 # Device modal/form
|   |   |   |-- lights/                # Lights page, cards, command history
|   |   |   |-- notifications/         # Header notification popup
|   |   |   `-- temperature/           # Temperature page, chart, insights
|   |   |-- constants/                 # knownFaces and UI constants
|   |   |-- lib/                       # apiClient, auth storage helpers
|   |   |-- routes/                    # TanStack file-based routes
|   |   |-- services/                  # REST clients for auth/device/light/camera/temperature/power
|   |   |-- types/                     # Frontend data types
|   |   |-- main.tsx                   # QueryClient + RouterProvider
|   |   `-- index.css                  # Global styles
|   |-- package.json
|   `-- vite.config.ts
|-- backend/
|   |-- src/
|   |   |-- auth/                      # Login, /auth/me, token signing, guard
|   |   |-- camera/                    # Camera logs, recognition, gate flow
|   |   |-- common/                    # Shared filters, interceptors, decorators
|   |   |-- devices/                   # Device registry and status
|   |   |-- health/                    # Public health endpoint
|   |   |-- lights/                    # Room settings and command history
|   |   |-- mqtt/                      # Shared MQTT service
|   |   |-- power/                     # Estimated power usage
|   |   |-- temperature/               # Temperature ingestion and queries
|   |   `-- users/                     # Mongo-backed users
|   |-- package.json
|   `-- tsconfig.json
|-- download_models.js                 # face-api.js model download helper
|-- main.py (ohstem)                   # Python script related to OhStem
|-- requirements_face.txt              # Optional Python dependencies
`-- README.md
```

## Backend modules

### `auth`

- `POST /auth/login`
- `GET /auth/me`
- seeds a default admin user when the `users` collection is empty
- global auth guard protects all APIs except explicitly public endpoints

### `devices`

- stores device state such as `light`, `camera`, `gate`, and `sensor`
- camera and gate status are updated when commands or recognition events occur

### `lights`

- stores room-based light state
- stores command history in the `light_commands` collection
- commands include a `trigger`
  - `manual`: user-driven toggle
  - `auto`: automatic shutoff used for notifications
- publishes MQTT messages to room-specific feeds

### `temperature`

- stores sensor temperature logs
- returns current and historical data
- used by the dashboard and temperature page

### `camera`

- stores logs in the `camera_logs` collection
- current events:
  - `camera_on`
  - `camera_off`
  - `face_detected`
- `face_detected` logs also contain `authorized`
  - `1`: accepted
  - `0`: denied
- when `authorized = 1`, the backend sends a gate-open command

### `power`

- reads from light command history
- computes estimated power usage for the dashboard

### `mqtt`

- shared publish/subscribe layer
- used by lights and camera flows to communicate with OhStem MQTT

## Authentication

The app requires sign-in before accessing:

- dashboard
- lights
- temperature
- camera

### Default account

When the `users` collection is empty, the backend seeds:

- Email: `admin@yolohome.local`
- Password: `admin12345`

### Auth behavior

- the frontend stores the token in `localStorage`
- `apiClient` automatically sends:

```http
Authorization: Bearer <token>
```

- if the backend returns `401`, the frontend clears the token and redirects to `/login`

## Face recognition

Face recognition is separate from login accounts.

- login accounts live in the MongoDB `users` collection
- face recognition uses reference images stored in the frontend
- `face-api.js` runs directly in the browser

### Relevant files

- face list: [frontend/src/constants/knownFaces.ts](/d:/smarthome/YOLOHOME/frontend/src/constants/knownFaces.ts)
- reference images: `frontend/public/known_faces/`
- model files: `frontend/public/models/`

### Add a new face

1. Add an image to `frontend/public/known_faces/<name>.jpg`
2. Register that image in `frontend/src/constants/knownFaces.ts`
3. Restart the frontend if needed so the new data is picked up

## Current notification rules

Notifications are currently aggregated in the frontend from backend logs.

### Data sources

- `GET /lights/commands`
- `GET /camera/logs`

### Notification conditions

- `Light`
  - only notify when `command = off` and `trigger = auto`
- `Camera accepted`
  - notify immediately when `face_detected` has `authorized = 1`
- `Camera denied`
  - for the same `face_label`, notify only starting from the 4th deny event

### Result

- the header badge reflects the number of notifications that match these rules
- the dashboard notification card and the header popup use the same aggregated source

## MQTT and device flow

### Lights

- frontend sends a command to the backend
- backend stores the command in MongoDB
- backend maps feeds by room name:
  - `Living Room` -> `V18`
  - `Bedroom` -> `V19`
  - `Kitchen` -> `V20`
- backend publishes `1` or `0` over MQTT

### Camera / Gate

- frontend sends recognition results to `POST /camera/recognize`
- backend stores `camera_logs`
- if `authorized = 1`
  - gate status becomes `open`
  - backend publishes a gate-open signal to feed `V7`
- backend also listens for gate status updates from MQTT to keep the UI in sync

### Temperature

- backend receives sensor data from MQTT
- stores it in MongoDB
- frontend reads it through REST APIs

## Local setup

### Requirements

- Node.js 20+
- npm
- MongoDB running locally or remotely
- Python 3.10+ only if you use the optional Python face-recognition flow

## Environment configuration

### Backend

The backend loads env vars from:

1. `backend/.env.local`
2. `backend/.env`

Example:

```env
APP_NAME=YoloHome API
PORT=3000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/yolohome
AUTH_TOKEN_SECRET=yolohome-dev-secret
AUTH_TOKEN_TTL_SECONDS=86400
```

### Frontend

Create `frontend/.env.local` if needed:

```env
VITE_API_URL=http://localhost:3000
```

## Run locally

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Start the backend

```bash
npm run dev
```

Default backend URLs:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

Default frontend URL:

- `http://localhost:5173`

### 5. Sign in

Use:

- email: `admin@yolohome.local`
- password: `admin12345`

## Default seed data

When the database is empty, the backend seeds:

- default admin user
- base device list
- light room settings
- sample light commands
- sample camera logs

In addition, when camera/light schemas are extended, the repositories include backfill logic for older documents:

- `light_commands.trigger`
- `camera_logs.authorized`

## API

## Public endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Service health check |
| `POST` | `/auth/login` | Sign in |
| `POST` | `/auth/register` | Create an account through the API |

## Protected endpoints

All endpoints below require:

```http
Authorization: Bearer <token>
```

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/auth/me` | Get current user |
| `GET` | `/devices` | List devices |
| `POST` | `/devices` | Create a device |
| `GET` | `/lights/commands` | Get light command history |
| `POST` | `/lights/commands` | Legacy living-room light endpoint |
| `GET` | `/lights/rooms` | Get room light state |
| `POST` | `/lights/rooms/:room/command` | Send a room on/off command |
| `PATCH` | `/lights/rooms/:room/settings` | Update room settings |
| `GET` | `/temperature/logs` | Get temperature history |
| `GET` | `/temperature/current` | Get current temperature |
| `GET` | `/camera/logs` | Get camera logs |
| `POST` | `/camera/commands` | Turn camera on or off |
| `POST` | `/camera/recognize` | Submit face recognition result |
| `GET` | `/power/history` | Get estimated power history |

## API response shape

The backend uses a shared response interceptor. Successful responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "optional"
}
```

Error responses follow this format:

```json
{
  "success": false,
  "error": "message"
}
```

## Scripts

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
```

## Code quality

### Git hooks

| Hook | Purpose |
| --- | --- |
| `pre-commit` | Runs ESLint on staged `.ts` and `.tsx` files |
| `commit-msg` | Validates commit messages with commitlint |

### Conventional commits

Examples:

```text
feat: add notification aggregation
fix: correct camera deny threshold
docs: expand project readme
```

## Current implementation notes

- the login UI currently supports sign-in only
- the frontend does not expose a registration flow
- brightness and color temperature data still exist in the backend, but the lights UI focuses on on/off control
- notifications are currently aggregated in the frontend; there is no dedicated notifications collection yet
- for real automatic shutoff events beyond sample data, the backend or a scheduler must create light commands with `trigger: auto`
- the camera deny threshold is currently calculated per `face_label`

## Troubleshooting

### Sign-in redirects back to login

Check:

- whether the backend is running
- whether `AUTH_TOKEN_SECRET` changed while an older token is still stored
- whether `VITE_API_URL` points to the correct backend
- whether `FRONTEND_ORIGIN` matches the frontend host

### Camera recognition does not work

Check:

- whether webcam permission was granted in the browser
- whether model files exist in `frontend/public/models/`
- whether `knownFaces.ts` points to the correct reference images

### No temperature data appears

Check:

- whether MongoDB contains `temperature_logs`
- whether the sensor MQTT flow is publishing data
- whether the backend temperature service subscribed successfully

### Notifications are incorrect

Check:

- whether auto-off light commands have `trigger: auto`
- whether `face_detected` camera logs include `authorized`
- whether the backend was restarted after schema/backfill changes

## Runtime references

- Health check: `GET /health`
- Swagger UI: `http://localhost:3000/api`
