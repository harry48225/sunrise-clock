import React from 'react';

import { Form, Slider, Button, Row } from 'antd';

const marks = {
    5: '5m',
    10: '10m',
    15: '15m',
    20: '20m',
    30: '30m',
};

function SunsetPanel({start_sunset}) {

    const onFinish = (values) => {
        console.log(values)
        start_sunset(values.duration);
    };

    return (
    <> 
    <Form onFinish={onFinish}>
        <Row justify='space-around'>
            <div style = {{ flexGrow: 4 }}>
                <Form.Item rules = {[{required:true}]} name="duration">
                
                    <Slider style = {{ marginRight: 50 }} min={5} max={30} marks={marks} />
                
                </Form.Item>
            </div>
            <Form.Item>
                <Button style = {{ marginRight: 25 }} shape="round" type="primary" htmlType="submit"><code>start sunset</code></Button>
            </Form.Item>
        </Row>
            
    </Form>
    </>
    )
}

export default SunsetPanel;