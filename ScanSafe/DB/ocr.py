# ocr.py
import easyocr
import cv2 as cv
from PIL import Image, ImageOps
import numpy as np
from pathlib import Path

import threading
Reader = None
Reader_lock = threading.Lock()

def getReader():
    global Reader
    if Reader is None:
        with Reader_lock:
            if Reader is None:
                Reader = easyocr.Reader(['en'], gpu=False)
    return Reader

#for testing
Threshold=50

def PreprocessImage(image):
    rgb = np.array(image)                         
    gray = cv.cvtColor(rgb, cv.COLOR_RGB2GRAY)    
    clahe = cv.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    output = clahe.apply(gray)                    
    return output

def IsTooBlurry(InputImg, threshold=Threshold):
    lap = cv.Laplacian(InputImg, cv.CV_64F).var()
    print("The Lapician value is:", lap)
    return lap < threshold

def Main(ImgPath):
    image = ImageOps.exif_transpose(Image.open(Path(ImgPath)))
    width, height = image.size

    ScaleFactor = min(1600 / height, 1600 / width, 1.0)  
    image = image.resize((int(width * ScaleFactor), int(height * ScaleFactor)), resample=Image.Resampling.BICUBIC)
    step1Img = PreprocessImage(image)
    if IsTooBlurry(step1Img, threshold=Threshold): return []  


    reader = getReader()
    result = reader.readtext(step1Img, detail=0, paragraph=True, mag_ratio=2)
    

    if not result: return []
    return result


