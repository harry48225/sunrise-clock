# ```sunrise.local```

raspberry pi powered sunrise (simulating) alarm clock. built using react and python.

## ```web app```

## ```wiring```

![wiring diagram](https://github.com/harry48225/sunrise-clock/blob/master/schematics/wiring_bb.png)

## ```setup```

* ensure that the raspberry pi has the hostname ```sunrise```
* wire up as shown in the diagram
* configure nginx to serve the react app and proxy requests to ```/api/``` to port ```5000``` on which run the flask server serving ```backend.py```
* run ```client.py``` which controls the neopixel ring


