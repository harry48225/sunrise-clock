const ping = require('ping')
const fetch = require('node-fetch')

// we will ping this host and start a sunset when it goes offline
// but only if it goes offline between certain times
const HOST = "fangorn.local"

const START_HOUR = 20
const SLEEP_DURATION = 1 // duration in seconds

console.log("started")

const States = {
    IDLE: 1, // not looking for the shutdown event
    WAITING_FOR_SHUTDOWN: 2,
    WAITING_FOR_BOOT: 3,
    WAITING_FOR_NEXT_DAY: 4, 
}


let current_state = States.IDLE

// states should go IDLE -> WAITING_FOR_BOOT -> WAITING_FOR_SHUTDOWN -> WAITING_FOR_NEXT_DAY -> IDLE
// and regardless of state if we're not in the active times then go to idle

async function main_loop() {
    
    let today = new Date()

    if (today.getHours() < START_HOUR) {
        current_state = States.IDLE
    }

    if (current_state === States.IDLE) {
        // check to see if we should become active

        // if it's after 2200
        if (today.getHours() >= START_HOUR) {
            current_state = States.WAITING_FOR_BOOT
        }
    }

    else if (current_state === States.WAITING_FOR_BOOT || current_state === States.WAITING_FOR_SHUTDOWN) {

        let response = await ping.promise.probe(HOST)

        let is_booted = response.alive
        
        if (current_state === States.WAITING_FOR_BOOT && is_booted) {
            current_state = States.WAITING_FOR_SHUTDOWN
        }

        else if (current_state === States.WAITING_FOR_SHUTDOWN && !is_booted) {

            fetch("http://sunrise.local/api/start_sunset", 
                {method : 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({duration: 30}) }).then((res) => (console.log("sunrise reponse: " + res)))

            current_state = States.WAITING_FOR_NEXT_DAY
            console.log("sunset started")
            
        }

    }

    else if (current_state === States.WAITING_FOR_NEXT_DAY) {
        
        // before 0100 move to idle
        if (today.getHours() < 1) {
            current_state = States.IDLE
        }

    }

    console.log(current_state)
    setTimeout(main_loop, SLEEP_DURATION * 1000) // sleep
}

main_loop()