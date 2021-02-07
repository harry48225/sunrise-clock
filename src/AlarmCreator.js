import React from 'react';

import { Form, Button, TimePicker, Row } from 'antd';
import Item from 'antd/lib/list/Item';

function AlarmCreator() {

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return (
        <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Form.Item
                name="time">
                    <Row justify='space-around' align="middle">
                        <span>Time</span>
                        <TimePicker format="HH:mm"/>
                        <Button type="primary" htmlType="submit">Add alarm</Button>
                    </Row>
            </Form.Item>
        </Form>
    )
}

export default AlarmCreator;