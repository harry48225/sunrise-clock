import React from 'react';
import { SwatchesPicker } from 'react-color';
import { Button, Row } from 'antd';

function UserColourPicker() {

    return (
        <>
            <Row justify='space-around' style={{ marginBottom:20 }}><SwatchesPicker width={400}/></Row>
            <Row justify='space-around'><Button shape="round" type="primary">Clear</Button></Row>
        </>
    )
}

export default UserColourPicker;