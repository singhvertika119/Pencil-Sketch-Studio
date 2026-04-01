import cv2
import numpy as np


def convert_to_pencil_sketch(file_bytes: bytes) -> np.ndarray:
    np_buffer = np.frombuffer(file_bytes, dtype=np.uint8)
    image = cv2.imdecode(np_buffer, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Invalid image data.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    inverted = cv2.bitwise_not(gray)

    # Small kernel keeps detail while remaining fast.
    blurred = cv2.GaussianBlur(inverted, (21, 21), sigmaX=0, sigmaY=0)
    inverted_blur = cv2.bitwise_not(blurred)

    sketch = cv2.divide(gray, inverted_blur, scale=256.0)
    return sketch
