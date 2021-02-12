import board
import neopixel
import adafruit_fancyled.adafruit_fancyled as fancy

import requests
from time import sleep

pixels = neopixel.NeoPixel(board.D18, 24, auto_write=False, brightness=1, pixel_order=neopixel.GRBW) # 24 pixels , brightness at half for now

pixels.fill((0, 0, 0, 0))
pixels.show()
sleep(1)
pixels.fill((255,0,0,0))
pixels.show()
sleep(1)
pixels.fill((0,255,0,0))
pixels.show()
sleep(1)
pixels.fill((0,0,255,0))
pixels.show()
sleep(1)
pixels.fill((0,0,0,255))
pixels.show()
sleep(1)
pixels.fill((0, 0, 0, 0))
pixels.show()
sleep(1)

# Turn off the pixels

while True:

    # Get the colour

    colour = requests.get("http://localhost/api/get_colour_rgbw").json()
    print(f"color: {colour}")

    fancy_colour = fancy.CRGB(colour['r'], colour['g'], colour['b'])
    pixels.fill(fancy.gamma_adjust(fancy_colour).pack())# colour['w']))
    pixels.show()
    print("sleeping")
    sleep(1)
