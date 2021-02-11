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
                <Form.Item label="Time" rules={[{required:true, type:'object'}]}
                    name="time">
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item>
                <Button type="primary" htmlType="submit">Add alarm</Button>
                </Form.Item>
            </Row>
        </Form>
    )
}

export default AlarmCreator;