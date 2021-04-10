const ping = require('ping')
const fetch = require('node-fetch')
const mdns = require('multicast-dns')()

// we will ping this host and start a sunset when it goes offline
// but only if it goes offline between certain times
const HOST = process.env.HOST
let HOST_IP = null;

let SUNRISE_IP = null;

const START_HOUR = process.env.START_HOUR
console.log(START_HOUR)
const SLEEP_DURATION = 10 // duration in seconds



mdns.on('response', function(response) {
    response.answers.forEach((answer) => {
        if (answer.name == HOST) {
            HOST_IP = answer.data
            console.log("discovered " + HOST + " at " + HOST_IP)
        }

        else if (answer.name == "sunrise.local") {
            SUNRISE_IP = answer.data
            console.log("discovered sunrise.local at " + SUNRISE_IP)
        }
    })

    if (current_state === States.IDLE && SUNRISE_IP !== null && HOST_IP !== null) {
        current_state = States.WAITING_FOR_BOOT
    }
    
})



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

        // if it's after the start hour
        if (today.getHours() >= START_HOUR) {
            
            // get the latest ip addresses of the hosts to monitor
            mdns.query({
                questions:[{
                    name:HOST,
                    type: 'A'
                },
                {
                    name:"sunrise.local",
                    type: 'A'
                }]
            })

            HOST_IP = null;
            SUNRISE_IP = null;

            console.log("queryed mDNS")
        }
    }

    else if (current_state === States.WAITING_FOR_BOOT || current_state === States.WAITING_FOR_SHUTDOWN) {

        let response = await ping.promise.probe(HOST_IP)

        let is_booted = response.alive
        
        if (current_state === States.WAITING_FOR_BOOT && is_booted) {
            current_state = States.WAITING_FOR_SHUTDOWN
        }

        else if (current_state === States.WAITING_FOR_SHUTDOWN && !is_booted) {

            fetch(`http://${SUNRISE_IP}/api/start_sunset`, 
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