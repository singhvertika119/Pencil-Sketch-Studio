import base64

import cv2
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from utils.image_processor import convert_to_pencil_sketch

ALLOWED_TYPES = {"image/png", "image/jpeg", "image/jpg"}

app = FastAPI(title="Image Sketch API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/convert")
async def convert_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PNG, JPG, and JPEG are allowed.")

    try:
        file_bytes = await file.read()
        sketch = convert_to_pencil_sketch(file_bytes)
        success, encoded = cv2.imencode(".png", sketch)
        if not success:
            raise ValueError("Unable to encode image.")

        base64_image = base64.b64encode(encoded.tobytes()).decode("utf-8")
        return {"image": base64_image}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail="Failed to process image.") from error
