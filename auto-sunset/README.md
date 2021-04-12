put a computer to monitor in the script and the time to start monitoring from.

then if the computer stops responding to pings (ideally because it has shutdown) after that time then a sunset will automatically be triggered.

building
`docker built -t harry/auto-sunset .`

example run command
`docker run -d -e TZ="Europe/London" -e HOST="fangorn.local" -e START_HOUR=21 --network=host harry/auto-sunset`