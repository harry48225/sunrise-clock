import React from 'react';

import { Form, Button, TimePicker, Row, Input } from 'antd';
import Item from 'antd/lib/list/Item';
import moment from 'moment';

function AlarmCreator({add_alarm_callback}) {

    const onFinish = (values) => {
        add_alarm_callback(values.time.format("HH:mm"));
        console.log('Success:', values.time.format("HH:mm"));
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return (
        <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Row justify="space-around" align="middle">
                <span><code>alarm time:</code></span>
                <Form.Item style={{margin:0}} rules={[{required:true, type:'object'}]}
                    name="time">
                    <TimePicker format="HH:mm" placeholder="" style={{ width: 80 }}/>
                </Form.Item>
                <Form.Item style={{margin:0}}>
                <Button shape="round" type="primary" htmlType="submit"><code>add alarm</code></Button>
                </Form.Item>
            </Row>
        </Form>
    )
}

export default AlarmCreator;