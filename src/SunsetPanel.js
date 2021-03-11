import React from 'react';

import { Slider, Button, Row } from 'antd';

const marks = {
    5: '5m',
    10: '10m',
    15: '15m',
    20: '20m',
    30: '30m',
};

function SunsetPanel() {
//style = {{width: '100%'}}
    return (
    <> 
        <Row justify='space-around'>
            <div style = {{ flexGrow: 4 }}>
                <Slider style = {{ marginRight: 50 }} min={5} max={30} marks={marks} />
            </div>
            <Button style = {{ marginRight: 25 }} shape="round" type="primary">start sunset</Button></Row>
    </>
    )
}

export default SunsetPanel;