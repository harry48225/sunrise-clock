import Title from 'antd/lib/skeleton/Title';
import React from 'react';
import { Line } from 'react-chartjs-2';

function TimeWave() {

    const data = {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        datasets: [
            {
                data: [-50,-51, -48, -43, -36, -28, -20, -11, -3, 4, 10, 15, 17, 18, 16, 12, 7, 0, -7, -15, -24, -33, -40, -46],
                fill: false,
                pointRadius: 0, // Remove the points
                borderColor: 'rgba(255,85,43, 1)',
                cubicInterpolationMode: 'monotone',
            }
        ]
    }
    const options = {
        layout: {
            padding: {
                top: 0,
            },
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
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
        <Line data={data} options={options}/>
    )
}

export default TimeWave;