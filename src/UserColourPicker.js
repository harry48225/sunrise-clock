import React from 'react';
import { SwatchesPicker } from 'react-color';
import { Button, Row } from 'antd';

function UserColourPicker({ set_colour_callback }) {

    function handleChange(color) {
        console.log(color.rgb.r, color.rgb.g, color.rgb.b)
        set_colour_callback(color.rgb.r, color.rgb.g, color.rgb.b);
    }

    return (
        <>
            <Row justify='space-around' style={{ marginBottom:20 }}><SwatchesPicker width={400} onChange={handleChange}/></Row>
            <Row justify='space-around'><Button shape="round" type="primary" onClick={() => set_colour_callback(0,0,0)}>Clear</Button></Row>
        </>
    )
}

export default UserColourPicker;