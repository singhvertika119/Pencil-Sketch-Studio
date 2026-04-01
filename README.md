# Image Sketch Studio

A full-stack web app that turns uploaded photos into pencil-style sketches. The UI is dark-first with a glassmorphism look; the backend uses OpenCV for the sketch effect and FastAPI for the API.

## Features

- **Drag-and-drop upload** (PNG, JPG, JPEG only)
- **Before / after** comparison with a slider (`react-compare-slider`)
- **Animated transitions** (Framer Motion) and a **shimmer** state while processing
- **Download** the resulting sketch as a PNG
- **REST API** that returns the sketch as **base64** JSON

## Tech stack

| Layer | Technologies |
|--------|----------------|
| Frontend | React (Vite), Tailwind CSS, Framer Motion, Lucide React, Axios, react-dropzone, react-compare-slider, shadcn-style UI primitives (`class-variance-authority`, `clsx`, `tailwind-merge`) |
| Backend | Python, FastAPI, Uvicorn |
| Image processing | OpenCV (`opencv-python-headless`), NumPy |

## Project structure

```
image-sketch/
├── frontend/          # Vite + React app
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/ui/
│   │   └── lib/
│   ├── vite.config.js
│   └── package.json
├── backend/           # FastAPI service
│   ├── main.py
│   ├── utils/
│   │   └── image_processor.py   # OpenCV pencil sketch pipeline
│   └── requirements.txt
└── README.md
```

## Prerequisites

- **Node.js** (compatible with Vite 6; see [Vite’s Node support](https://vite.dev/guide/))
- **Python 3.10+** recommended

## Backend

From the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment (Windows PowerShell):

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies and run the server:

```bash
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

- **Health:** `GET http://127.0.0.1:8000/health`
- **Convert:** `POST http://127.0.0.1:8000/convert`  
  - Body: `multipart/form-data` with field name `file`  
  - Response JSON: `{ "image": "<base64-encoded PNG>" }`  
  - Errors: `400` for unsupported MIME types or invalid image data

CORS is open to all origins for local development.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (default **http://localhost:5173**).

### API URL

The app calls the backend at **`http://127.0.0.1:8000`** by default. To override:

```bash
# Windows PowerShell
$env:VITE_API_URL="http://localhost:8000"; npm run dev
```

Or create `frontend/.env.local`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Production build

```bash
cd frontend
npm run build
npm run preview   # optional: test the production build locally
```

## Sketch algorithm (OpenCV)

The pipeline in `backend/utils/image_processor.py`:

1. Decode the image and convert to **grayscale**
2. **Invert** the grayscale image
3. Apply **Gaussian blur** to the inverted image
4. Blend using a **color dodge**–style operation (`cv2.divide` with the blurred inverted layer) to produce the final sketch

## License

Add a license file if you plan to distribute this project.
