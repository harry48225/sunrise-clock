#!/bin/bash
if [ "$1" == "frontend" ]; then
    echo frontend!
    npm run build
    echo "Copying frontend"
    rsync -r build/ pi@sunrise.local:/home/pi/frontend
    echo "Copied frontend"
fi

if [ "$1" == "backend" ]; then
    echo "dumping requirements"
    cd backend
    source venv/bin/activate
    pip freeze > requirements.txt
    deactivate
    cd ..
    echo "Copying backend"
    rsync -r backend/*.py pi@sunrise.local:/home/pi/backend
    echo "Copying requirements"
    rsync backend/requirements.txt pi@sunrise.local:/home/pi/backend
fi

# Note then need to install nginx and set the root to be /home/pi/frontend, then proxy requests to /api/ to 127.0.0.1:5000
