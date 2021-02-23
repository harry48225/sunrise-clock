import board
import neopixel
import adafruit_fancyled.adafruit_fancyled as fancy

import requests
from time import sleep

pixels = neopixel.NeoPixel(board.D12, 24, auto_write=False, brightness=1, pixel_order=neopixel.GRBW) # 24 pixels , brightness at half for now

while True:

    # Get the colour

    try:
        colour = requests.get("http://localhost/api/get_colour_rgbw").json()
        print(f"color: {colour}")

        fancy_colour = fancy.CRGB(colour['r'], colour['g'], colour['b'])
        fancy_colour = fancy.gamma_adjust(fancy_colour, brightness=(0.83, 1, 0.5))
        print(fancy_colour)
        red = int(fancy_colour.red * 255)
        green = int(fancy_colour.green * 255)
        blue = int(fancy_colour.blue * 255)
        white = colour['w'] if colour['w'] > 200 else 0
        print(f"{red}, {green}, {blue}, {white}")
        pixels.fill((red,green,blue,white))
        pixels.show()
        print("sleeping")
        
    except:
        pass    
    finally:
        sleep(1)
