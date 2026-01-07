from pyzbar.pyzbar import decode
from PIL import Image


def GetGtin(ImagePath):
    Barcode = Image.open(ImagePath, 'r')
    imgDecoded = decode(Barcode)
    if not imgDecoded: 
        return None
    return imgDecoded[0].data.decode("utf-8")



