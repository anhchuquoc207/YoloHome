# YoloHome — Smart AIoT Dashboard

A smart home monitoring and control dashboard built with React, TypeScript, NestJS, and MongoDB.

## Features

- **Dashboard** — Overview of all devices, climate stats, and power consumption
- **Lights** — Room-by-room light control with brightness and color temperature
- **Temperature** — Real-time temperature & humidity charts with trend insights
- **Camera** — Live webcam preview, AI face recognition, security event log, gate control

## Tech Stack

### Frontend

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 + TypeScript |
| Bundler | Vite 8 |
| Routing | TanStack Router (file-based) |
| Data Fetching | TanStack Query |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Webcam | react-webcam |
| Face Recognition | face-api.js (chạy AI trong browser) |
| Linting | ESLint + typescript-eslint |
| Git Hooks | Husky + lint-staged + commitlint |

### Backend

| Layer | Technology |
|-------|-----------|
| Framework | NestJS 11 + TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Validation | class-validator + class-transformer |
| Config | @nestjs/config |

## Project Structure

```
YOLOHOME/
│
├── frontend/
│   └── src/
│       ├── routes/
│       │   ├── index.tsx
│       │   ├── lights.tsx
│       │   ├── temperature.tsx
│       │   └── camera.tsx
│       ├── components/
│       │   ├── dashboard/
│       │   ├── lights/
│       │   ├── temperature/
│       │   ├── camera/
│       │   │   ├── CameraPage.tsx      # Main page, polling gate 2s
│       │   │   ├── CameraPreview.tsx   # Webcam + face-api.js AI overlay
│       │   │   ├── CameraControls.tsx
│       │   │   ├── SecuritySummary.tsx
│       │   │   ├── InsightTile.tsx
│       │   │   └── EventConfig.tsx
│       │   └── forms/
│       ├── constants/
│       │   └── knownFaces.ts          # Danh sách khuôn mặt được phép
│       ├── schemas/
│       ├── services/
│       │   └── cameraService.ts       # getCamera, getGate, getCameraLogs,
│       │                              # sendCameraCommand, sendRecognition
│       ├── lib/
│       └── types/
│
├── backend/
│   └── src/
│       ├── common/
│       ├── devices/
│       ├── lights/
│       ├── temperature/
│       ├── camera/
│       │   ├── dto/
│       │   │   ├── camera-command.dto.ts
│       │   │   └── camera-recognize.dto.ts   # DTO cho nhận diện khuôn mặt
│       │   ├── controllers/camera.controller.ts
│       │   ├── services/camera.service.ts
│       │   └── repositories/camera.repository.ts
│       ├── power/
│       └── health/
│
├── download_models.js              # Script tải model AI face-api.js
└── requirements_face.txt           # Python dependencies
```

## Face Recognition — Kiến trúc

```
[Browser — localhost:5173/camera]
  ├─ react-webcam  →  live video stream
  ├─ face-api.js   →  detect + recognize face (mỗi 3 giây)
  │     ├─ model: /public/models/         (SSD + Landmark + Recognition)
  │     └─ known: /public/known_faces/    (ảnh người được phép)
  └─ onRecognize(authorized, label)
           │
           ↓  POST /camera/recognize
      [NestJS Backend]
        ├─ Lưu log face_detected vào camera_logs
        └─ authorized=1 → updateGateStatus('open')
                        → tự đóng lại sau 5 giây
           │
           ↓  polling 2s
      [Frontend — tile "Front Gate"]
        Open / Closed
```

---

**Python script** (`camera/face_recognition_client.py`) thay thế được browser nếu chạy trên Raspberry Pi:
```
[Python + OpenCV + face_recognition]  →  POST /camera/recognize  →  backend mở cổng
```

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas (hoặc local `mongodb://localhost:27017/yolohome`)
- Python 3.10+ (chỉ cần nếu dùng Python script)

### 1. Backend

Tạo file `backend/.env.local`:

```env
APP_NAME=YoloHome API
PORT=3000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/yolohome?retryWrites=true&w=majority
```

```bash
cd backend
npm install
npm run dev        # http://localhost:3000
```

Lần đầu chạy, backend tự seed data (devices, camera logs...) nếu collection rỗng.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Model AI face-api.js đã có sẵn tại `frontend/public/models/`.  
Nếu cần tải lại:
```bash
node download_models.js
```

**Thêm người vào danh sách nhận diện:**
1. Copy ảnh vào `frontend/public/known_faces/<tên>.jpg`
2. Thêm dòng vào `frontend/src/constants/knownFaces.ts`:
```ts
export const KNOWN_FACES: Record<string, string> = {
  quynh:   '/known_faces/quynh.jpg',
  quocanh: '/known_faces/quocanh.jpg',
  // thêm người: ten: '/known_faces/ten.jpg',
}
```

### 3. Python script (tùy chọn — thay thế browser face recognition)

```bash
pip install -r requirements_face.txt
cd camera
python face_recognition_client.py
```

Ảnh known faces đặt tại `camera/faces/<tên>.jpg`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/devices` | Danh sách thiết bị (filter: `?type=camera\|gate\|light\|sensor`) |
| POST | `/devices` | Thêm thiết bị mới |
| GET | `/lights/commands` | Lịch sử lệnh đèn |
| POST | `/lights/commands` | Gửi lệnh đèn |
| GET | `/lights/rooms` | Trạng thái 3 phòng |
| POST | `/lights/rooms/:room/command` | Toggle đèn theo phòng |
| PATCH | `/lights/rooms/:room/settings` | Cập nhật brightness/colorTemp |
| GET | `/temperature/logs` | Lịch sử nhiệt độ |
| GET | `/temperature/current` | Đọc hiện tại |
| GET | `/camera/logs` | Lịch sử camera |
| POST | `/camera/commands` | Bật/tắt camera |
| POST | `/camera/recognize` | **Nhận diện khuôn mặt** → mở cổng nếu authorized=1 |
| GET | `/power/history` | Lịch sử tiêu thụ điện |

### POST `/camera/recognize`

```json
{
  "authorized": 1,
  "face_label": "quynh",
  "device_id": 3
}
```

- `authorized=1` → lưu log `face_detected` + mở gate → tự đóng sau 5 giây
- `authorized=0` → lưu log `face_detected` với note "Access denied"

## Device Types

| Type | Status values | Mô tả |
|------|--------------|-------|
| `light` | `on` / `off` | Đèn |
| `sensor` | `active` / `inactive` | Cảm biến |
| `camera` | `active` / `inactive` | Camera |
| `gate` | `open` / `closed` | Cổng ra vào |

## Available Scripts

### Frontend

```bash
npm run dev         # Start dev server với HMR
npm run build       # Type check + production build
npm run lint        # Run ESLint
npm run preview     # Preview production build
```

### Backend

```bash
npm run dev         # Start với watch mode
npm run build       # Compile TypeScript
npm run start       # Run compiled output
npm run type-check  # Type check only
```

## Git Hooks

| Hook | What it does |
|------|-------------|
| `pre-commit` | Runs `eslint --max-warnings=0` on staged `.ts`/`.tsx` files |
| `commit-msg` | Validates commit message format via commitlint |

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add login page
fix: resolve light toggle bug
chore: update dependencies
docs: update README
refactor: split temperature components
```

## Forms

Forms use **React Hook Form** + **Zod** for type-safe validation. Schemas live in `src/schemas/`, reusable field components in `src/components/forms/`.
npm run type-check  # Type check only
```

## Git Hooks

| Hook | What it does |
|------|-------------|
| `pre-commit` | Runs `eslint --max-warnings=0` on staged `.ts`/`.tsx` files |
| `commit-msg` | Validates commit message format via commitlint |

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add login page
fix: resolve light toggle bug
chore: update dependencies
docs: update README
refactor: split temperature components
```

## Forms

Forms use **React Hook Form** + **Zod** for type-safe validation. Schemas live in `src/schemas/`, reusable field components in `src/components/forms/`.

```ts
const schema = z.object({ name: z.string().min(2) })
type FormValues = z.infer<typeof schema>

const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { name: '' },
})
```
"# YoloHome" 
