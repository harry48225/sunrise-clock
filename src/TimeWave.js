import React from 'react';
import { Line } from 'react-chartjs-2';

function TimeWave() {

    // Hardcoded maybe change in the future
    const LATITUDE = 53.6
    const LONGITUDE = -2.48
    var SunCalc = require('suncalc');

    var data = {};

    function compute_sun_positions() {
        let today = new Date();

        today.setHours(0);
        today.setMinutes(0);
        
        var altitude_array = [];

        for (let i = 0; i < 24; i++) {
            today.setHours(i);

            let sunPos = SunCalc.getPosition(today, LATITUDE, LONGITUDE);
            altitude_array.push(sunPos.altitude);
        }

        today.setDate(today.getDate() + 1);
        let sunPos = SunCalc.getPosition(today, LATITUDE, LONGITUDE);
        altitude_array.push(sunPos.altitude);

        data = {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            datasets: [
                {
                    data: altitude_array,
                    fill: false,
                    pointRadius: 0, // Remove the points
                    borderColor: '#C1CDCD',//'rgba(255,85,43, 1)',
                    cubicInterpolationMode: 'monotone',
                }
            ]
        }
    }

    compute_sun_positions();
    const options = {
        layout: {
            padding: {
                top: 0,
            },
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: true
                },
                ticks: {
                    display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display: true
                },
                ticks: {
                    display: false
                }
            }]
        },
        legend: {
          display: false  
        },
    }

    
    return (
        <>
        <Line data={data} options={options}/>
        <p style={{textAlign: 'center', marginTop: 15, marginBottom: -10}}><code>sun elevation</code></p>
        </>
    )
}

export default TimeWave;